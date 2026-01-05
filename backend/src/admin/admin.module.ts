import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminShopController } from './admin-shop.controller';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [ShopModule],
  controllers: [AdminController, AdminShopController],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
