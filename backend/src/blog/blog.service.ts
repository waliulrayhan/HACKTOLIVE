import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBlogDto, UpdateBlogDto, FilterBlogDto, CreateCommentDto, CreateCommentReplyDto, CreateLikeDto, ToggleCommentLikeDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBlogDto: CreateBlogDto, user?: any) {
    // Check if slug already exists
    const existingBlog = await this.prisma.blog.findUnique({
      where: { slug: createBlogDto.slug },
    });

    if (existingBlog) {
      throw new ConflictException('Blog with this slug already exists');
    }

    // Convert tags array to JSON string
    const tagsString = JSON.stringify(createBlogDto.tags);

    // If user is provided, use their ID as authorId
    const authorId = user ? user.id : createBlogDto.authorId;

    return this.prisma.blog.create({
      data: {
        ...createBlogDto,
        authorId,
        tags: tagsString,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            role: true,
            twitterUrl: true,
            linkedinUrl: true,
            githubUrl: true,
          },
        },
        comments: true,
        likes: true,
      },
    });
  }

  async findAll(filterDto: FilterBlogDto) {
    const { 
      category, 
      blogType, 
      status, 
      featured, 
      search, 
      tags, 
      page = 1, 
      limit = 10,
      sortBy = 'publishDate',
      sortOrder = 'desc'
    } = filterDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.BlogWhereInput = {
      ...(category && { category }),
      ...(blogType && { blogType }),
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { metadata: { contains: search } },
          { content: { contains: search } },
          { tags: { contains: search } },
        ],
      }),
      ...(tags && { tags: { contains: tags } }),
    };

    const [blogs, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true,
              role: true,
              facebookUrl: true,
              twitterUrl: true,
              linkedinUrl: true,
              instagramUrl: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      this.prisma.blog.count({ where }),
    ]);

    // Parse tags for each blog
    const blogsWithParsedTags = blogs.map(blog => ({
      ...blog,
      tags: JSON.parse(blog.tags),
    }));

    return {
      data: blogsWithParsedTags,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            role: true,
            twitterUrl: true,
            linkedinUrl: true,
            githubUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return {
      ...blog,
      tags: JSON.parse(blog.tags),
    };
  }

  async findBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            role: true,
            facebookUrl: true,
            twitterUrl: true,
            linkedinUrl: true,
            instagramUrl: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Increment views
    await this.prisma.blog.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });

    return {
      ...blog,
      tags: JSON.parse(blog.tags),
    };
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    // Check if blog exists
    const existingBlog = await this.prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    // If slug is being updated, check for conflicts
    if (updateBlogDto.slug && updateBlogDto.slug !== existingBlog.slug) {
      const slugExists = await this.prisma.blog.findUnique({
        where: { slug: updateBlogDto.slug },
      });

      if (slugExists) {
        throw new ConflictException('Blog with this slug already exists');
      }
    }

    // Convert tags array to JSON string if provided
    const data: any = {
      ...updateBlogDto,
    };

    if (updateBlogDto.tags) {
      data.tags = JSON.stringify(updateBlogDto.tags);
    }

    return this.prisma.blog.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            role: true,
          },
        },
        comments: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.prisma.blog.delete({
      where: { id },
    });
  }

  async getRelatedBlogs(blogId: string, limit: number = 3) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Get related blogs based on category or blogType
    const relatedBlogs = await this.prisma.blog.findMany({
      where: {
        id: { not: blogId },
        status: 'PUBLISHED',
        OR: [
          { category: blog.category },
          { blogType: blog.blogType },
        ],
      },
      take: limit,
      orderBy: { publishDate: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return relatedBlogs.map(blog => ({
      ...blog,
      tags: JSON.parse(blog.tags),
    }));
  }

  async getFeaturedBlogs(limit: number = 6) {
    const blogs = await this.prisma.blog.findMany({
      where: {
        featured: true,
        status: 'PUBLISHED',
      },
      take: limit,
      orderBy: { publishDate: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return blogs.map(blog => ({
      ...blog,
      tags: JSON.parse(blog.tags),
    }));
  }

  // Comment operations
  async addComment(blogId: string, createCommentDto: CreateCommentDto, user?: any) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (!user || !user.id) {
      throw new Error('User must be authenticated to comment');
    }

    return this.prisma.blogComment.create({
      data: {
        blogId,
        userId: user.id,
        comment: createCommentDto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  }

  async getComments(blogId: string) {
    // Get only top-level comments (no parentId)
    const comments = await this.prisma.blogComment.findMany({
      where: { 
        blogId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to include likes count
    return comments.map(comment => ({
      ...comment,
      likes: comment._count.likes,
      replies: comment.replies.map(reply => ({
        ...reply,
        likes: reply._count.likes,
      })),
    }));
  }

  async addCommentReply(commentId: string, createReplyDto: CreateCommentReplyDto, user?: any) {
    const parentComment = await this.prisma.blogComment.findUnique({
      where: { id: commentId },
    });

    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    if (!user || !user.id) {
      throw new Error('User must be authenticated to reply');
    }

    const reply = await this.prisma.blogComment.create({
      data: {
        blogId: parentComment.blogId,
        userId: user.id,
        comment: createReplyDto.comment,
        parentId: commentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return {
      ...reply,
      likes: reply._count.likes,
    };
  }

  async toggleCommentLike(commentId: string, toggleLikeDto: ToggleCommentLikeDto) {
    const comment = await this.prisma.blogComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if like exists
    const existingLike = await this.prisma.blogCommentLike.findUnique({
      where: {
        commentId_userEmail: {
          commentId,
          userEmail: toggleLikeDto.userEmail || '',
        },
      },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.blogCommentLike.delete({
        where: { id: existingLike.id },
      });
      return { liked: false, message: 'Comment unliked successfully' };
    } else {
      // Like
      await this.prisma.blogCommentLike.create({
        data: {
          commentId,
          userEmail: toggleLikeDto.userEmail || '',
        },
      });
      return { liked: true, message: 'Comment liked successfully' };
    }
  }

  async getCommentLikesCount(commentId: string) {
    return this.prisma.blogCommentLike.count({
      where: { commentId },
    });
  }

  async deleteComment(commentId: string) {
    const comment = await this.prisma.blogComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return this.prisma.blogComment.delete({
      where: { id: commentId },
    });
  }

  // Like operations
  async toggleLike(blogId: string, createLikeDto: CreateLikeDto) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if like exists
    const existingLike = await this.prisma.blogLike.findUnique({
      where: {
        blogId_userEmail: {
          blogId,
          userEmail: createLikeDto.userEmail || '',
        },
      },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.blogLike.delete({
        where: { id: existingLike.id },
      });
      return { liked: false, message: 'Blog unliked successfully' };
    } else {
      // Like
      await this.prisma.blogLike.create({
        data: {
          blogId,
          ...createLikeDto,
        },
      });
      return { liked: true, message: 'Blog liked successfully' };
    }
  }

  async getLikesCount(blogId: string) {
    return this.prisma.blogLike.count({
      where: { blogId },
    });
  }

  async hasUserLiked(blogId: string, userEmail: string) {
    const like = await this.prisma.blogLike.findUnique({
      where: {
        blogId_userEmail: {
          blogId,
          userEmail: userEmail || '',
        },
      },
    });
    return !!like;
  }

  async getBlogStats() {
    const [total, published, draft, archived, totalViews] = await Promise.all([
      this.prisma.blog.count(),
      this.prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.blog.count({ where: { status: 'DRAFT' } }),
      this.prisma.blog.count({ where: { status: 'ARCHIVED' } }),
      this.prisma.blog.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      total,
      published,
      draft,
      archived,
      totalViews: totalViews._sum.views || 0,
    };
  }
}
