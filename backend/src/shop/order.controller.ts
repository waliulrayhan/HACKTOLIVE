import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, CreatePaymentDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('shop/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    const userId = req.user?.userId;
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Request() req: any, @Query() query: any) {
    return this.orderService.findUserOrders(req.user.id, query);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllOrders(@Query() query: any) {
    return this.orderService.findAllOrders(query);
  }

  @Get('number/:orderNumber')
  async getOrderByNumber(@Param('orderNumber') orderNumber: string) {
    return this.orderService.findOrderByNumber(orderNumber);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId;
    return this.orderService.findOrderById(id, userId);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId;
    return this.orderService.cancelOrder(id, userId);
  }

  @Post('payments')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.orderService.createPayment(createPaymentDto);
  }

  @Post('payments/:id/confirm')
  async confirmPayment(@Param('id') id: string, @Body('transactionId') transactionId: string) {
    return this.orderService.confirmPayment(id, transactionId);
  }

  @Post(':id/invoice')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async generateInvoice(@Param('id') id: string) {
    return this.orderService.generateInvoice(id);
  }
}
