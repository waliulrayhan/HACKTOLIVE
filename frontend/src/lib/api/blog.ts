const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface BlogFilters {
  category?: string;
  blogType?: string;
  status?: string;
  featured?: boolean;
  search?: string;
  tags?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  mainImage?: string;
  metadata: string;
  content?: string;
  category: string;
  blogType: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    role: string;
    facebookUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
  };
  publishDate: string;
  readTime?: string;
  tags: string[];
  featured: boolean;
  status: string;
  views: number;
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface BlogResponse {
  data: Blog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Comment {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  likes: number;
  replies: Comment[];
}

// Convert API format to frontend format
const convertBlogFormat = (blog: any) => {
  // Map category from API format (CYBERSECURITY_INSIGHTS) to display format (Cybersecurity Insights)
  const categoryMap: Record<string, string> = {
    'CYBERSECURITY_INSIGHTS': 'Cybersecurity Insights',
    'NEWS': 'News',
    'TUTORIALS': 'Tutorials',
  };

  const blogTypeMap: Record<string, string> = {
    'THREAT_ALERTS': 'Threat Alerts',
    'HOW_TO_TUTORIALS': 'How-to Tutorials',
    'BEST_SECURITY_PRACTICES': 'Best Security Practices',
    'COMPLIANCE_GUIDES': 'Compliance Guides',
    'CASE_STUDY_STORIES': 'Case Study Stories',
  };

  // Extract social URLs from author object if they exist
  const extractUsername = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    // Extract username from URL (e.g., "https://twitter.com/username" -> "username")
    const match = url.match(/\/([^\/]+)\/?$/);
    return match ? match[1] : url;
  };

  return {
    ...blog,
    _id: blog.id,
    category: categoryMap[blog.category] || blog.category,
    blogType: blogTypeMap[blog.blogType] || blog.blogType,
    author: {
      name: blog.author?.name || blog.authorName,
      avatar: blog.author?.avatar || blog.authorAvatar,
      role: blog.author?.role || blog.authorRole,
      bio: blog.author?.bio || blog.authorBio,
      facebook: extractUsername(blog.author?.facebookUrl),
      twitter: extractUsername(blog.author?.twitterUrl),
      linkedin: extractUsername(blog.author?.linkedinUrl),
      instagram: extractUsername(blog.author?.instagramUrl),
    },
  };
};

export const blogApi = {
  // Get all blogs with filters
  async getBlogs(filters?: BlogFilters): Promise<BlogResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    // Convert frontend category format to API format
    if (filters?.category && filters.category !== 'All') {
      const categoryApiMap: Record<string, string> = {
        'Cybersecurity Insights': 'CYBERSECURITY_INSIGHTS',
        'News': 'NEWS',
        'Tutorials': 'TUTORIALS',
      };
      params.set('category', categoryApiMap[filters.category] || filters.category);
    }

    // Convert frontend blogType format to API format
    if (filters?.blogType && filters.blogType !== 'All') {
      const blogTypeApiMap: Record<string, string> = {
        'Threat Alerts': 'THREAT_ALERTS',
        'How-to Tutorials': 'HOW_TO_TUTORIALS',
        'Best Security Practices': 'BEST_SECURITY_PRACTICES',
        'Compliance Guides': 'COMPLIANCE_GUIDES',
        'Case Study Stories': 'CASE_STUDY_STORIES',
      };
      params.set('blogType', blogTypeApiMap[filters.blogType] || filters.blogType);
    }

    const response = await fetch(`${API_URL}/blog?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const data = await response.json();
    
    return {
      data: data.data.map(convertBlogFormat),
      meta: data.meta,
    };
  },

  // Get a single blog by slug
  async getBlogBySlug(slug: string): Promise<any> {
    const response = await fetch(`${API_URL}/blog/slug/${slug}`);
    
    if (!response.ok) {
      throw new Error('Blog not found');
    }

    const blog = await response.json();
    return convertBlogFormat(blog);
  },

  // Get featured blogs
  async getFeaturedBlogs(limit: number = 6): Promise<Blog[]> {
    const response = await fetch(`${API_URL}/blog/featured?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured blogs');
    }

    const blogs = await response.json();
    return blogs.map(convertBlogFormat);
  },

  // Get related blogs
  async getRelatedBlogs(blogId: string, limit: number = 3): Promise<Blog[]> {
    const response = await fetch(`${API_URL}/blog/${blogId}/related?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch related blogs');
    }

    const blogs = await response.json();
    return blogs.map(convertBlogFormat);
  },

  // Add a comment (requires authentication)
  async addComment(blogId: string, comment: string, token: string): Promise<Comment> {
    const response = await fetch(`${API_URL}/blog/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add comment');
    }

    return response.json();
  },

  // Get comments
  async getComments(blogId: string): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/blog/${blogId}/comments`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return response.json();
  },

  // Toggle like
  async toggleLike(blogId: string, userEmail: string, token?: string): Promise<{ liked: boolean; message: string }> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/blog/${blogId}/like`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userEmail }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    return response.json();
  },

  // Get likes count
  async getLikesCount(blogId: string): Promise<number> {
    const response = await fetch(`${API_URL}/blog/${blogId}/like/count`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch likes count');
    }

    return response.json();
  },

  // Check if user has liked a blog post
  async hasUserLiked(blogId: string, userEmail: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/blog/${blogId}/like/check?userEmail=${encodeURIComponent(userEmail)}`);
    
    if (!response.ok) {
      throw new Error('Failed to check like status');
    }

    return response.json();
  },

  // Add a reply to a comment (requires authentication)
  async addCommentReply(commentId: string, comment: string, token: string): Promise<Comment> {
    const response = await fetch(`${API_URL}/blog/comments/${commentId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add reply');
    }

    return response.json();
  },

  // Toggle comment like
  async toggleCommentLike(commentId: string, userEmail: string): Promise<{ liked: boolean; message: string }> {
    const response = await fetch(`${API_URL}/blog/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle comment like');
    }

    return response.json();
  },

  // Get comment likes count
  async getCommentLikesCount(commentId: string): Promise<number> {
    const response = await fetch(`${API_URL}/blog/comments/${commentId}/likes/count`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch comment likes count');
    }

    return response.json();
  },
};
