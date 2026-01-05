import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  selectedOptions?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class RemoveFromCartDto {
  @IsString()
  cartItemId: string;
}
