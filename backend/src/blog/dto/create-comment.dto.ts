import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsOptional()
  @IsString()
  userAvatar?: string;

  @IsString()
  @MinLength(3)
  comment: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
