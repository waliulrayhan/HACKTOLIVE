import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole, CourseStatus } from '@prisma/client';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // User Management
  @Get('users')
  getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      role,
      search,
    });
  }

  @Post('users')
  createUser(
    @Body()
    data: {
      email: string;
      password: string;
      name: string;
      role: UserRole;
    },
  ) {
    return this.adminService.createUser(data);
  }

  @Patch('users/:userId')
  updateUser(
    @Param('userId') userId: string,
    @Body() data: { name?: string; role?: UserRole },
  ) {
    return this.adminService.updateUser(userId, data);
  }

  @Delete('users/:userId')
  deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  // Course Management
  @Get('courses')
  getAllCourses(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: CourseStatus,
  ) {
    return this.adminService.getAllCourses({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
    });
  }

  @Post('courses/:courseId/approve')
  approveCourse(@Param('courseId') courseId: string) {
    return this.adminService.approveCourse(courseId);
  }

  @Post('courses/:courseId/reject')
  rejectCourse(@Param('courseId') courseId: string) {
    return this.adminService.rejectCourse(courseId);
  }

  @Delete('courses/:courseId')
  deleteCourse(@Param('courseId') courseId: string) {
    return this.adminService.deleteCourse(courseId);
  }

  // Analytics
  @Get('analytics/enrollments')
  getEnrollmentStats() {
    return this.adminService.getEnrollmentStats();
  }

  @Get('analytics/revenue')
  getRevenueStats() {
    return this.adminService.getRevenueStats();
  }

  @Get('analytics/popular-courses')
  getPopularCourses(@Query('limit') limit?: string) {
    return this.adminService.getPopularCourses(
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('analytics/top-instructors')
  getTopInstructors(@Query('limit') limit?: string) {
    return this.adminService.getTopInstructors(
      limit ? parseInt(limit) : 10,
    );
  }
}
