import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto, CreatePaymentDto, UpdateOrderStatusDto } from './dto/order.dto';
import { CartService } from './cart.service';
import { ProductService } from './product.service';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private productService: ProductService,
    private emailService: EmailService,
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

    // Send confirmation email to customer
    this.sendOrderConfirmationEmail(order);

    // Send notification email to admins
    this.sendAdminOrderNotification(order);

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

  async findOrderByNumber(orderNumber: string, userId?: string) {
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

    // If userId is provided, verify ownership
    if (userId && order.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.formatOrder(order);
  }

  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    console.log('📦 updateOrderStatus called:', { id, status: updateOrderStatusDto.status });
    
    // Fetch order first to check payment method
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // For COD orders, mark as COMPLETED when delivered
    const paymentStatus = 
      existingOrder.paymentMethod === 'CASH_ON_DELIVERY' && 
      updateOrderStatusDto.status === 'DELIVERED' &&
      existingOrder.paymentStatus === 'PENDING'
        ? 'COMPLETED'
        : existingOrder.paymentStatus;

    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderStatusDto.status,
        paymentStatus,
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

    console.log('📦 Order updated, sending email to:', order.customerEmail);

    // Send status update email to customer
    this.sendOrderStatusUpdateEmail(order, updateOrderStatusDto.status);

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

  /**
   * Send order confirmation email to customer
   */
  private async sendOrderConfirmationEmail(order: any): Promise<void> {
    try {
      // Format items for email
      const itemsHtml = order.items.map((item: any) => `
        <div style="display:flex;justify-content:space-between;padding:15px;border-bottom:1px solid #e5e7eb">
          <div>
            <p style="margin:0 0 5px;color:#333;font-weight:600">${item.productName}</p>
            <p style="margin:0;color:#666;font-size:13px">Quantity: ${item.quantity} × ${item.price.toFixed(2)} BDT</p>
          </div>
          <div style="text-align:right">
            <p style="margin:0;color:#333;font-weight:600">${item.total.toFixed(2)} BDT</p>
          </div>
        </div>
      `).join('');

      const shippingAddress = `${order.shippingAddress}, ${order.shippingCity}${order.shippingState ? ', ' + order.shippingState : ''}, ${order.shippingZip}, ${order.shippingCountry}`;

      await this.emailService.sendTemplateEmail(
        'order-confirmation-customer',
        order.customerEmail,
        {
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          orderDate: new Date(order.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          items: itemsHtml,
          subtotal: order.subtotal.toFixed(2),
          shippingCost: order.shippingCost.toFixed(2),
          tax: order.tax.toFixed(2),
          total: order.total.toFixed(2),
          shippingAddress: shippingAddress,
          orderUrl: `${process.env.FRONTEND_URL || 'https://hacktolive.net'}/shop/orders/${order.orderNumber}`,
        },
        order.customerName,
      );
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }

  /**
   * Send order notification to all admins
   */
  private async sendAdminOrderNotification(order: any): Promise<void> {
    try {
      // Get all admin emails
      const admins = await this.prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true, name: true },
      });

      for (const admin of admins) {
        await this.emailService.sendTemplateEmail(
          'new-order-admin-notification',
          admin.email,
          {
            orderNumber: order.orderNumber,
            orderDate: new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            total: order.total.toFixed(2),
            itemCount: order.items.length.toString(),
            orderUrl: `${process.env.FRONTEND_URL || 'https://hacktolive.net'}/admin/shop/orders/${order.id}`,
          },
          admin.name || 'Admin',
        );
      }
    } catch (error) {
      console.error('Failed to send admin order notification:', error);
    }
  }

  /**
   * Send order status update email to customer
   */
  private async sendOrderStatusUpdateEmail(order: any, status: string): Promise<void> {
    try {
      console.log('=== Sending Order Status Update Email ===');
      console.log('Order:', { id: order.id, orderNumber: order.orderNumber, customerEmail: order.customerEmail, status });
      
      const statusMessages: Record<string, string> = {
        CONFIRMED: 'Your order has been confirmed and is being prepared for shipment. We will notify you once it ships.',
        PROCESSING: 'Your order is currently being processed. Our team is working to prepare your items for shipment.',
        SHIPPED: 'Great news! Your order has been shipped and is on its way to you. You can track your package using the tracking number provided.',
        DELIVERED: 'Your order has been delivered successfully. We hope you enjoy your purchase! If you have any concerns, please contact us.',
        CANCELLED: 'Your order has been cancelled as requested. If you did not request this cancellation, please contact our support team immediately.',
        REFUNDED: 'Your order has been refunded. The refund amount will be credited to your original payment method within 5-7 business days.',
      };

      const result = await this.emailService.sendTemplateEmail(
        'order-status-update',
        order.customerEmail,
        {
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          status: status,
          statusMessage: statusMessages[status] || 'Your order status has been updated.',
          trackingNumber: order.trackingNumber || 'Not available yet',
          orderUrl: `${process.env.FRONTEND_URL || 'https://hacktolive.net'}/shop/orders/${order.orderNumber}`,
        },
        order.customerName,
      );
      
      console.log('Order status update email sent:', result);
    } catch (error) {
      console.error('Failed to send order status update email:', error);
      console.error('Error stack:', error.stack);
    }
  }
}
