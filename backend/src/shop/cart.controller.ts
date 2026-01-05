import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shop/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req: any, @Query('sessionId') sessionId?: string) {
    const userId = req.user?.userId;
    return this.cartService.getOrCreateCart(userId, sessionId);
  }

  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto, @Request() req: any) {
    const userId = req.user?.userId;
    const sessionId = addToCartDto.sessionId;
    return this.cartService.addToCart(addToCartDto, userId, sessionId);
  }

  @Put('items/:id')
  async updateCartItem(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto & { sessionId?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    const sessionId = updateCartItemDto.sessionId;
    return this.cartService.updateCartItem(id, updateCartItemDto, userId, sessionId);
  }

  @Delete('items/:id')
  async removeFromCart(
    @Param('id') id: string,
    @Body() body: { sessionId?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.userId;
    const sessionId = body?.sessionId;
    return this.cartService.removeFromCart(id, userId, sessionId);
  }

  @Delete('clear')
  async clearCart(@Body() body: { sessionId?: string }, @Request() req: any) {
    const userId = req.user?.userId;
    const sessionId = body?.sessionId;
    return this.cartService.clearCart(userId, sessionId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  async mergeCart(@Body() body: { sessionId: string }, @Request() req: any) {
    const userId = req.user.userId;
    const sessionId = body.sessionId;
    await this.cartService.mergeGuestCart(sessionId, userId);
    return { message: 'Cart merged successfully' };
  }
}
