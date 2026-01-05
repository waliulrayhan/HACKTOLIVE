import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';
import { ProductService } from '../shop/product.service';
import { OrderService } from '../shop/order.service';
import { CreateProductDto } from '../shop/dto/create-product.dto';
import { UpdateProductDto } from '../shop/dto/update-product.dto';
import { CreateCategoryDto } from '../shop/dto/create-category.dto';
import { UpdateCategoryDto } from '../shop/dto/update-category.dto';
import { UpdateOrderStatusDto } from '../shop/dto/order.dto';

@Controller('admin/shop')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminShopController {
  constructor(
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}

  // Product Management
  @Get('products')
  getAllProducts(@Query() query: any) {
    return this.productService.findAllProducts({ ...query, status: undefined });
  }

  @Post('products')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  // Category Management
  @Get('categories')
  getAllCategories() {
    return this.productService.findAllCategories();
  }

  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productService.createCategory(createCategoryDto);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.productService.deleteCategory(id);
  }

  // Order Management
  @Get('orders')
  getAllOrders(@Query() query: any) {
    return this.orderService.findAllOrders(query);
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.findOrderById(id);
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Post('orders/:id/invoice')
  generateInvoice(@Param('id') id: string) {
    return this.orderService.generateInvoice(id);
  }

  // Stats
  @Get('stats')
  async getShopStats() {
    // This could be implemented in a separate service
    return {
      message: 'Shop statistics endpoint - to be implemented',
    };
  }
}
