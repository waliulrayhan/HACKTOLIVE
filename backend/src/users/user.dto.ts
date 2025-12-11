import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'newpassword123', description: 'User password', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}
