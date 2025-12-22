import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto, FilterBlogDto, CreateCommentDto, CreateLikeDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    return this.blogService.create(createBlogDto, req.user);
  }

  @Get()
  findAll(@Query() filterDto: FilterBlogDto) {
    return this.blogService.findAll(filterDto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getStats() {
    return this.blogService.getBlogStats();
  }

  @Get('featured')
  getFeatured(@Query('limit') limit?: number) {
    return this.blogService.getFeaturedBlogs(limit ? +limit : 6);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Get(':id/related')
  getRelated(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.blogService.getRelatedBlogs(id, limit ? +limit : 3);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  // Comment endpoints
  @Post(':id/comments')
  addComment(
    @Param('id') blogId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.blogService.addComment(blogId, createCommentDto);
  }

  @Get(':id/comments')
  getComments(@Param('id') blogId: string) {
    return this.blogService.getComments(blogId);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(@Param('commentId') commentId: string) {
    return this.blogService.deleteComment(commentId);
  }

  // Like endpoints
  @Post(':id/like')
  toggleLike(
    @Param('id') blogId: string,
    @Body() createLikeDto: CreateLikeDto,
  ) {
    return this.blogService.toggleLike(blogId, createLikeDto);
  }

  @Get(':id/likes/count')
  getLikesCount(@Param('id') blogId: string) {
    return this.blogService.getLikesCount(blogId);
  }
}
