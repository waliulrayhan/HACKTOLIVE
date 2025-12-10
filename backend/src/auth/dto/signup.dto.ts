import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

// DTO for user signup with validation decorators
export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ 
    enum: UserRole, 
    required: false, 
    default: UserRole.STUDENT,
    example: UserRole.STUDENT 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
