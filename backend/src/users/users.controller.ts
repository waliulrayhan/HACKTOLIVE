import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users or a specific user by ID' })
  @ApiQuery({ name: 'id', description: 'User ID', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns all users or a specific user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findAll(@Query('id') id?: string) {
    if (id) {
      return this.usersService.findOne(id);
    }
    return this.usersService.findAll();
  }

  @Patch()
  @ApiOperation({ summary: 'Update a user' })
  @ApiQuery({ name: 'id', description: 'User ID', required: true, type: String })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Query('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiQuery({ name: 'id', description: 'User ID', required: true, type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Query('id') id: string) {
    return this.usersService.remove(id);
  }
}
