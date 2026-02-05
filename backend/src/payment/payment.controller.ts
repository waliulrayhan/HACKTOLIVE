import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.guard';
import { UserRole, CoursePaymentStatus } from '@prisma/client';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Initiate payment for course or product
   * Works for both authenticated and guest users
   */
  @Post('initiate')
  async initiatePayment(@Request() req, @Body() body: InitiatePaymentDto) {
    const userId = req.user?.userId; // Optional for guest checkout
    return this.paymentService.initiatePayment(userId, body);
  }

  /**
   * IPN (Instant Payment Notification) endpoint
   * This is called by SSLCommerz when payment status changes
   */
  @Post('ipn')
  @HttpCode(HttpStatus.OK)
  async handleIPN(@Body() ipnData: any) {
    this.logger.log('Received IPN notification');
    return this.paymentService.handleIPN(ipnData);
  }

  /**
   * Verify and complete payment
   * Called from frontend after redirect from SSLCommerz
   * No auth required as this is called from SSLCommerz redirect
   */
  @Post('verify/:transactionId')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(@Param('transactionId') transactionId: string, @Body() data?: any) {
    this.logger.log(`Verifying payment: ${transactionId}`);
    
    try {
      // Always validate with SSLCommerz first - don't trust redirect or IPN alone
      const payment = await this.paymentService.verifyAndValidatePayment(transactionId);
      return payment;
    } catch (error) {
      this.logger.error(`Error verifying payment ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  @Get('status/:transactionId')
  @UseGuards(JwtAuthGuard)
  async getPaymentStatus(@Param('transactionId') transactionId: string) {
    return this.paymentService.getPayment(transactionId);
  }

  /**
   * Admin: Get all payments
   */
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllPayments(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: CoursePaymentStatus,
    @Query('search') search?: string,
  ) {
    return this.paymentService.getAllPayments(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      status,
      search,
    );
  }

  /**
   * Admin: Get payment statistics
   */
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getPaymentStats() {
    return this.paymentService.getPaymentStats();
  }

  /**
   * Admin: Manually complete a validated payment
   */
  @Post('admin/complete/:paymentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async completePayment(@Param('paymentId') paymentId: string) {
    return this.paymentService.completePayment(paymentId);
  }
}
