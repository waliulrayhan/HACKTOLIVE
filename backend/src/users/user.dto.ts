import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength, IsUrl } from 'class-validator';

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

  @ApiProperty({ example: '+1 234 567 8900', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Team Manager', description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '/images/user/avatar.jpg', description: 'Avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'Phoenix', description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Arizona', description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'United States', description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'https://www.facebook.com/user', description: 'Facebook URL', required: false })
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @ApiProperty({ example: 'https://x.com/user', description: 'Twitter/X URL', required: false })
  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @ApiProperty({ example: 'https://www.linkedin.com/in/user', description: 'LinkedIn URL', required: false })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiProperty({ example: 'https://instagram.com/user', description: 'Instagram URL', required: false })
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;
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

  @ApiProperty({ example: '+1 234 567 8900', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Team Manager', description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '/images/user/avatar.jpg', description: 'Avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'Phoenix', description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Arizona', description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'United States', description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'https://www.facebook.com/user', description: 'Facebook URL', required: false })
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @ApiProperty({ example: 'https://x.com/user', description: 'Twitter/X URL', required: false })
  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @ApiProperty({ example: 'https://www.linkedin.com/in/user', description: 'LinkedIn URL', required: false })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiProperty({ example: 'https://instagram.com/user', description: 'Instagram URL', required: false })
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '+1 234 567 8900', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Team Manager', description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '/images/user/avatar.jpg', description: 'Avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'Phoenix', description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Arizona', description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'United States', description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

export class UpdateSocialLinksDto {
  @ApiProperty({ example: 'https://www.facebook.com/user', description: 'Facebook URL', required: false })
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @ApiProperty({ example: 'https://x.com/user', description: 'Twitter/X URL', required: false })
  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @ApiProperty({ example: 'https://www.linkedin.com/in/user', description: 'LinkedIn URL', required: false })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiProperty({ example: 'https://instagram.com/user', description: 'Instagram URL', required: false })
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;
}
