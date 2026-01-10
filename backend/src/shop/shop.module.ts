import { Module } from '@nestjs/common';
import { ProductController, CategoryController } from './product.controller';
import { CartController } from './cart.controller';
import { OrderController } from './order.controller';
import { ProductService } from './product.service';
import { CartService } from './cart.service';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [ProductController, CategoryController, CartController, OrderController],
  providers: [ProductService, CartService, OrderService, PrismaService],
  exports: [ProductService, CartService, OrderService],
})
export class ShopModule {}
