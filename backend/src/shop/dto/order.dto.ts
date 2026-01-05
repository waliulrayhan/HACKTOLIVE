import { IsString, IsNumber, IsOptional, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethod {
  MOBILE_BANKING = 'MOBILE_BANKING',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export class CreateOrderDto {
  @IsString()
  customerEmail: string;

  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsString()
  shippingAddress: string;

  @IsString()
  shippingCity: string;

  @IsString()
  @IsOptional()
  shippingState?: string;

  @IsString()
  shippingZip: string;

  @IsString()
  shippingCountry: string;

  @IsString()
  @IsOptional()
  billingAddress?: string;

  @IsString()
  @IsOptional()
  billingCity?: string;

  @IsString()
  @IsOptional()
  billingState?: string;

  @IsString()
  @IsOptional()
  billingZip?: string;

  @IsString()
  @IsOptional()
  billingCountry?: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class CreatePaymentDto {
  @IsString()
  orderId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  // Mobile Banking
  @IsString()
  @IsOptional()
  mobileNumber?: string;

  @IsString()
  @IsOptional()
  mobileProvider?: string; // bKash, Nagad, Rocket

  // Card Payment
  @IsString()
  @IsOptional()
  cardToken?: string;

  // Bank Transfer
  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  transferReference?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
