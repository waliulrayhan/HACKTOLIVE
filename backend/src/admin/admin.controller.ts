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

  @Get('courses/:courseId')
  getCourse(@Param('courseId') courseId: string) {
    return this.adminService.getCourse(courseId);
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

  // Blog Management
  @Get('blogs/pending')
  getPendingBlogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getPendingBlogs(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('blogs')
  getAllBlogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('approvalStatus') approvalStatus?: string,
  ) {
    return this.adminService.getAllBlogs({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      approvalStatus,
    });
  }

  @Post('blogs/:blogId/approve')
  approveBlog(@Param('blogId') blogId: string, @Body() body: any) {
    return this.adminService.approveBlog(blogId, body.adminId);
  }

  @Post('blogs/:blogId/reject')
  rejectBlog(
    @Param('blogId') blogId: string,
    @Body() body: { adminId: string; reason?: string },
  ) {
    return this.adminService.rejectBlog(blogId, body.adminId, body.reason);
  }

  @Delete('blogs/:blogId')
  deleteBlog(@Param('blogId') blogId: string) {
    return this.adminService.deleteBlog(blogId);
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

  @Post('sync-instructor-stats')
  syncInstructorStats() {
    return this.adminService.syncInstructorStats();
  }

  // Newsletter Management
  @Get('newsletter/subscribers')
  @ApiOperation({ summary: 'Get all newsletter subscribers' })
  getNewsletterSubscribers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getNewsletterSubscribers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      search,
    });
  }

  @Delete('newsletter/subscribers/:id')
  @ApiOperation({ summary: 'Delete newsletter subscriber' })
  deleteNewsletterSubscriber(@Param('id') id: string) {
    return this.adminService.deleteNewsletterSubscriber(id);
  }

  @Get('newsletter/campaigns')
  @ApiOperation({ summary: 'Get all newsletter campaigns' })
  getNewsletterCampaigns(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getNewsletterCampaigns({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Get('newsletter/campaigns/:id')
  @ApiOperation({ summary: 'Get newsletter campaign by ID' })
  getNewsletterCampaignById(@Param('id') id: string) {
    return this.adminService.getNewsletterCampaignById(id);
  }

  @Post('newsletter/campaigns')
  @ApiOperation({ summary: 'Create newsletter campaign' })
  createNewsletterCampaign(
    @Body() data: any,
  ) {
    return this.adminService.createNewsletterCampaign(data);
  }

  @Patch('newsletter/campaigns/:id')
  @ApiOperation({ summary: 'Update newsletter campaign' })
  updateNewsletterCampaign(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.adminService.updateNewsletterCampaign(id, data);
  }

  @Delete('newsletter/campaigns/:id')
  @ApiOperation({ summary: 'Delete newsletter campaign' })
  deleteNewsletterCampaign(@Param('id') id: string) {
    return this.adminService.deleteNewsletterCampaign(id);
  }

  @Post('newsletter/campaigns/:id/send')
  @ApiOperation({ summary: 'Send newsletter campaign' })
  sendNewsletterCampaign(@Param('id') id: string) {
    return this.adminService.sendNewsletterCampaign(id);
  }

  @Get('newsletter/stats')
  @ApiOperation({ summary: 'Get newsletter statistics' })
  getNewsletterStats() {
    return this.adminService.getNewsletterStats();
  }

  // Notice Management
  @Get('notices')
  @ApiOperation({ summary: 'Get all notices (Admin only)' })
  getAllNotices() {
    return this.adminService.getAllNotices();
  }

  @Post('notices')
  @ApiOperation({ summary: 'Create a notice (Admin only)' })
  createNotice(
    @Body()
    data: {
      title?: string;
      message: string;
      linkUrl?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ) {
    return this.adminService.createNotice(data);
  }

  @Patch('notices/:id')
  @ApiOperation({ summary: 'Update a notice (Admin only)' })
  updateNotice(
    @Param('id') id: string,
    @Body()
    data: {
      title?: string;
      message?: string;
      linkUrl?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ) {
    return this.adminService.updateNotice(id, data);
  }

  @Delete('notices/:id')
  @ApiOperation({ summary: 'Delete a notice (Admin only)' })
  deleteNotice(@Param('id') id: string) {
    return this.adminService.deleteNotice(id);
  }
}
