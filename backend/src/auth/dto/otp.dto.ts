import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'user-uuid', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
  code: string;
}

export class SendPasswordResetOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class VerifyPasswordResetOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class ResendOtpDto {
  @ApiProperty({ example: 'user-uuid', description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ 
    example: 'REGISTRATION', 
    description: 'OTP type', 
    enum: ['REGISTRATION', 'LOGIN', 'PASSWORD_RESET'] 
  })
  @IsString()
  @IsNotEmpty()
  type: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET';
}
