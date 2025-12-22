"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlinePencilAlt,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineNewspaper,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineTag,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { getFullImageUrl } from '@/lib/image-utils';

interface Blog {
  id: string;
  title: string;
  slug: string;
  mainImage?: string;
  metadata?: string;
  content: string;
  category: string;
  blogType: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  readTime?: string;
  tags?: string[];
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function BlogsManagementPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  const fetchBlogs = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error('Failed to fetch blogs');
      
      const result = await response.json();
      const data = result.data || result || [];
      setAllBlogs(data);
      
      // Apply filters
      let filteredData = data;
      if (statusFilter !== 'ALL') {
        filteredData = filteredData.filter((blog: Blog) => blog.status === statusFilter);
      }
      if (categoryFilter !== 'ALL') {
        filteredData = filteredData.filter((blog: Blog) => blog.category === categoryFilter);
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((blog: Blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setBlogs(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to load blogs', {
          description: 'Please try again',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, categoryFilter, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, itemsPerPage]);

  const handleTogglePublish = async (blogId: string, currentStatus: string, blogTitle: string) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update blog status');
      
      toast.success(`Blog ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}!`, {
        description: `${blogTitle} has been ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}`,
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog status:', error);
      toast.error('Failed to update blog status', {
        description: 'Please try again',
      });
    }
  };

  const openDeleteModal = (blogId: string, blogTitle: string) => {
    setBlogToDelete({ id: blogId, title: blogTitle });
    setShowDeleteModal(true);
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${blogToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete blog');
      
      toast.success('Blog deleted successfully!');
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const handleEditBlog = (blogId: string) => {
    router.push(`/admin/blogs/${blogId}/edit`);
  };

  const handleCreateBlog = () => {
    router.push('/admin/blogs/create');
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'PUBLISHED'
      ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500'
      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500';
  };

  const getCategoryBadgeClass = (category: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500',
      'Education': 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500',
      'Business': 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-500',
      'Design': 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-500',
      'Development': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-500',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get unique categories from all blogs
  const categories = Array.from(new Set((allBlogs || []).map(blog => blog.category)));

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Blog Management" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Blog Management" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineNewspaper className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Blogs</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{allBlogs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allBlogs.filter(b => b.status === 'PUBLISHED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
              <HiOutlineDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Drafts</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allBlogs.filter(b => b.status === 'DRAFT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineTag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Categories</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Blog Posts</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Create, edit, and manage all blog posts
            </p>
          </div>
          <Button
            onClick={handleCreateBlog}
            className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30"
          >
            <HiOutlinePlus className="h-4 w-4" />
            New Blog Post
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, category, or tags... (Press Enter to search)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchTerm(searchInput);
                  }
                }}
                className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-10 text-xs text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSearchTerm('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Clear search"
                >
                  <HiOutlineX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell isHeader className="w-[35%] px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Blog Post
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Author
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </span>
                  </TableCell>
                  <TableCell isHeader className="w-32 px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id} className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2">
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div className="flex items-start gap-2">
                        {blog.mainImage && (
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                            <img
                              src={getFullImageUrl(blog.mainImage, 'general')}
                              alt={blog.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">
                            {blog.title}
                          </p>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getCategoryBadgeClass(blog.category)}`}>
                              {blog.category}
                            </span>
                            {blog.readTime && (
                              <span className="flex items-center gap-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                                <HiOutlineClock className="h-3 w-3" />
                                {blog.readTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div className="flex items-center justify-center gap-2">
                        {blog.authorAvatar ? (
                          <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <img
                              src={getFullImageUrl(blog.authorAvatar, 'avatar')}
                              alt={blog.authorName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-6 w-6 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <HiOutlineUser className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {blog.authorName}
                          </p>
                          {blog.authorRole && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              {blog.authorRole}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className={`inline-flex px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full ${getStatusBadgeClass(blog.status)}`}>
                        {blog.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div className="flex items-center justify-center gap-1">
                        <HiOutlineCalendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openViewModal(blog)}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                          title="View details"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditBlog(blog.id)}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-brand-600 transition-colors hover:bg-brand-100 dark:text-brand-500 dark:hover:bg-brand-500/10"
                          title="Edit"
                        >
                          <HiOutlinePencilAlt className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(blog.id, blog.status, blog.title)}
                          className={`inline-flex items-center justify-center rounded-lg p-1.5 transition-colors ${
                            blog.status === 'PUBLISHED'
                              ? 'text-yellow-600 hover:bg-yellow-100 dark:text-yellow-500 dark:hover:bg-yellow-500/10'
                              : 'text-success-600 hover:bg-success-100 dark:text-success-500 dark:hover:bg-success-500/10'
                          }`}
                          title={blog.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                        >
                          {blog.status === 'PUBLISHED' ? (
                            <HiOutlineXCircle className="h-4 w-4" />
                          ) : (
                            <HiOutlineCheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openDeleteModal(blog.id, blog.title)}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-error-600 transition-colors hover:bg-error-100 dark:text-error-500 dark:hover:bg-error-500/10"
                          title="Delete"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {blogs.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <HiOutlineNewspaper className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">No blog posts found</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 px-3 sm:px-4 py-3 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="h-7 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                of {pagination.total} results
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={pagination.page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="First page"
              >
                <span className="text-xs">«</span>
              </button>
              
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Previous page"
              >
                <span className="text-xs">‹</span>
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (pagination.totalPages <= 7) return true;
                  if (page === 1 || page === pagination.totalPages) return true;
                  if (Math.abs(page - pagination.page) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="flex h-7 w-7 items-center justify-center text-xs text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                        pagination.page === page
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Next page"
              >
                <span className="text-xs">›</span>
              </button>
              
              <button
                onClick={() => setCurrentPage(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Last page"
              >
                <span className="text-xs">»</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Blog Post Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              {/* Blog Image */}
              {selectedBlog.mainImage && (
                <div className="mb-5 -mx-6 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={getFullImageUrl(selectedBlog.mainImage, 'general')}
                      alt={selectedBlog.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Blog Title and Status */}
              <div className="pb-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-2 mb-3">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white flex-1">
                    {selectedBlog.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(selectedBlog.status)}`}>
                    {selectedBlog.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeClass(selectedBlog.category)}`}>
                    {selectedBlog.category}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400">
                    {selectedBlog.blogType}
                  </span>
                </div>
                {selectedBlog.metadata && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedBlog.metadata}
                  </p>
                )}
              </div>

              {/* Blog Details */}
              <div className="space-y-4 pt-5">
                {/* Author Info */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <HiOutlineUser className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Author</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedBlog.authorName}</p>
                    {selectedBlog.authorRole && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">{selectedBlog.authorRole}</p>
                    )}
                  </div>
                </div>

                {/* Read Time & Dates */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <HiOutlineClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Read Time</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedBlog.readTime || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <HiOutlineCalendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Dates</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      Created: {formatDate(selectedBlog.createdAt)}
                    </p>
                    {selectedBlog.publishedAt && (
                      <p className="text-sm text-gray-900 dark:text-white">
                        Published: {formatDate(selectedBlog.publishedAt)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <HiOutlineTag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBlog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Preview */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Content Preview</p>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div
                      className="text-sm text-gray-700 dark:text-gray-300 line-clamp-6"
                      dangerouslySetInnerHTML={{ __html: selectedBlog.content.substring(0, 300) + '...' }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setShowModal(false)}
                  className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleEditBlog(selectedBlog.id);
                  }}
                  className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30"
                >
                  <HiOutlinePencilAlt className="h-4 w-4" />
                  Edit Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && blogToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Blog Post
                </h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{blogToDelete.title}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone and will permanently remove this blog post from the system.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBlog}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <HiOutlineTrash className="h-4 w-4" />
                    Delete Blog
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
