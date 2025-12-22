import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateLikeDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEmail()
  userEmail?: string;
}
