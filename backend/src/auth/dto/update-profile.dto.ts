import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '/images/user/avatar.jpg', description: 'Avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'Team Manager', description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '+1 234 567 8900', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

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

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Current password' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123', description: 'New password' })
  @IsString()
  newPassword: string;
}
