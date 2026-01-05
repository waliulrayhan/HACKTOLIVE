import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto, CreatePaymentDto, UpdateOrderStatusDto } from './dto/order.dto';
import { CartService } from './cart.service';
import { ProductService } from './product.service';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId?: string) {
    const { sessionId, ...orderData } = createOrderDto;

    // Get cart
    const cart = await this.cartService.getOrCreateCart(userId, sessionId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Verify stock for all items
    for (const item of cart.items) {
      const hasStock = await this.productService.checkStock(item.productId, item.quantity);
      if (!hasStock) {
        throw new BadRequestException(`Insufficient stock for ${item.product.name}`);
      }
    }

    // Calculate totals
    const subtotal = cart.subtotal;
    const tax = subtotal * 0.0; // No tax for now
    const shippingCost = this.calculateShipping(cart);
    const total = subtotal + tax + shippingCost;

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        ...orderData,
        subtotal,
        tax,
        shippingCost,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: cart.items.map((item: any) => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.thumbnail || (item.product.images?.[0] || null),
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            selectedOptions: item.selectedOptions ? JSON.stringify(item.selectedOptions) : null,
            voucherCode: item.product.type === 'COURSE_VOUCHER' ? this.generateVoucherCode() : null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear cart
    await this.cartService.clearCart(userId, sessionId);

    return this.formatOrder(order);
  }

  async findUserOrders(userId: string, query: any = {}) {
    const { page = 1, limit = 10, status } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // If no userId provided, return empty result
    if (!userId) {
      return {
        data: [],
        meta: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0,
        },
      };
    }

    // Get user's email to find guest orders placed with same email
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    const where: any = {
      OR: [
        { userId },
        ...(user?.email ? [{ customerEmail: user.email, userId: null }] : []),
      ],
    };

    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  thumbnail: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => this.formatOrder(order)),
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findAllOrders(query: any = {}) {
    const { page = 1, limit = 20, status, paymentStatus, search } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerEmail: { contains: search } },
        { customerName: { contains: search } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => this.formatOrder(order)),
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findOrderById(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        invoice: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // If userId is provided, verify ownership
    if (userId && order.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.formatOrder(order);
  }

  async findOrderByNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        invoice: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.formatOrder(order);
  }

  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
        trackingNumber: updateOrderStatusDto.trackingNumber,
        notes: updateOrderStatusDto.notes,
        completedAt: updateOrderStatusDto.status === 'DELIVERED' ? new Date() : undefined,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.formatOrder(order);
  }

  async cancelOrder(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (userId && order.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    // Restore stock
    for (const item of order.items) {
      await this.productService.increaseStock(item.productId, item.quantity);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { orderId, ...paymentData } = createPaymentDto;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentStatus === 'COMPLETED') {
      throw new BadRequestException('Order is already paid');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        ...paymentData,
        currency: 'BDT',
        status: 'PENDING',
      },
    });

    return payment;
  }

  async confirmPayment(paymentId: string, transactionId: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        transactionId,
        paidAt: new Date(),
      },
      include: { order: { include: { items: true } } },
    });

    // Update order
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'CONFIRMED',
      },
    });

    // Reduce stock
    for (const item of payment.order.items) {
      await this.productService.reduceStock(item.productId, item.quantity);
    }

    // Generate invoice
    await this.generateInvoice(payment.orderId);

    return payment;
  }

  async generateInvoice(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if invoice already exists
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { orderId },
    });

    if (existingInvoice) {
      return existingInvoice;
    }

    const invoiceNumber = this.generateInvoiceNumber();

    return this.prisma.invoice.create({
      data: {
        orderId,
        invoiceNumber,
        issuedAt: new Date(),
      },
    });
  }

  private calculateShipping(cart: any): number {
    // Simple shipping calculation
    // You can implement more complex logic based on weight, location, etc.
    return 0; // Free shipping for now
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  private generateInvoiceNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `INV-${timestamp}-${random}`;
  }

  private generateVoucherCode(): string {
    return `VCH-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  private formatOrder(order: any) {
    return {
      ...order,
      items: order.items?.map((item: any) => ({
        ...item,
        selectedOptions: item.selectedOptions ? JSON.parse(item.selectedOptions) : null,
        product: item.product
          ? {
              ...item.product,
              images: item.product.images ? JSON.parse(item.product.images) : [],
            }
          : undefined,
      })),
    };
  }
}
