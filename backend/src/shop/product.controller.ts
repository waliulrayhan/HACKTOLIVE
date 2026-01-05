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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('shop/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.productService.findAllProducts(query);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findProductBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findProductById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}

@Controller('shop/categories')
export class CategoryController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAllCategories();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findCategoryBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productService.createCategory(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.productService.deleteCategory(id);
  }
}
