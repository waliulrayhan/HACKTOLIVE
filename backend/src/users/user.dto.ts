import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  name?: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address', required: false })
  email?: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  name?: string;

  @ApiProperty({ example: 'newpassword123', description: 'User password', required: false })
  password?: string;
}
