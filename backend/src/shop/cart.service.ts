import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { ProductService } from './product.service';
import { randomUUID } from 'crypto';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
  ) {}

  async getOrCreateCart(userId?: string, sessionId?: string) {
    // Generate sessionId if neither userId nor sessionId provided
    if (!userId && !sessionId) {
      sessionId = randomUUID();
    }

    let cart;

    if (userId) {
      cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        });
      }
    } else {
      cart = await this.prisma.cart.findUnique({
        where: { sessionId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { sessionId },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        });
      }
    }

    return this.formatCart(cart);
  }

  async addToCart(addToCartDto: AddToCartDto, userId?: string, sessionId?: string) {
    const { productId, quantity, selectedOptions } = addToCartDto;

    // Generate sessionId if neither userId nor sessionId provided
    if (!userId && !sessionId) {
      sessionId = randomUUID();
    }

    // Verify product exists and is available
    const product = await this.productService.findProductById(productId);

    if (product.status !== 'ACTIVE') {
      throw new BadRequestException('Product is not available');
    }

    // Check stock
    const hasStock = await this.productService.checkStock(productId, quantity);
    if (!hasStock) {
      throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart - need the raw cart with id, not formatted
    let cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: userId ? { userId } : { sessionId },
      });
    }

    // Check if item already exists in cart with same options
    const selectedOptionsStr = selectedOptions ? JSON.stringify(selectedOptions) : null;

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        selectedOptions: selectedOptionsStr,
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      // Check stock for new quantity
      const hasStock = await this.productService.checkStock(productId, newQuantity);
      if (!hasStock) {
        throw new BadRequestException('Insufficient stock for requested quantity');
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Add new item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
          selectedOptions: selectedOptionsStr,
        },
      });
    }

    const result = await this.getOrCreateCart(userId, sessionId);
    // Return sessionId to client so they can use it for subsequent requests
    return { ...result, sessionId: cart.sessionId };
  }

  async updateCartItem(cartItemId: string, updateCartItemDto: UpdateCartItemDto, userId?: string, sessionId?: string) {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, product: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify cart ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    if (sessionId && cartItem.cart.sessionId !== sessionId) {
      throw new BadRequestException('Unauthorized');
    }

    // Check stock
    const hasStock = await this.productService.checkStock(cartItem.productId, quantity);
    if (!hasStock) {
      throw new BadRequestException('Insufficient stock');
    }

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return this.getOrCreateCart(userId, sessionId);
  }

  async removeFromCart(cartItemId: string, userId?: string, sessionId?: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify cart ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    if (sessionId && cartItem.cart.sessionId !== sessionId) {
      throw new BadRequestException('Unauthorized');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return this.getOrCreateCart(userId, sessionId);
  }

  async clearCart(userId?: string, sessionId?: string) {
    let cart = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getOrCreateCart(userId, sessionId);
  }

  async mergeGuestCart(sessionId: string, userId: string) {
    const guestCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return;
    }

    let userCart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      userCart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Merge items
    for (const item of guestCart.items) {
      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productId: item.productId,
          selectedOptions: item.selectedOptions,
        },
      });

      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            selectedOptions: item.selectedOptions,
          },
        });
      }
    }

    // Delete guest cart
    await this.prisma.cart.delete({
      where: { id: guestCart.id },
    });
  }

  private formatCart(cart: any) {
    const items = cart.items.map((item: any) => ({
      ...item,
      selectedOptions: item.selectedOptions ? JSON.parse(item.selectedOptions) : null,
      product: {
        ...item.product,
        images: item.product.images ? JSON.parse(item.product.images) : [],
      },
    }));

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    return {
      ...cart,
      items,
      itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      subtotal,
    };
  }
}
