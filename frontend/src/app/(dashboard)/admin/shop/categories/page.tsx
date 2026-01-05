"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineTag,
  HiOutlineCollection,
  HiOutlineStar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Modal } from "@/components/ui/modal";
import { categoryService, ProductCategory } from '@/lib/shop-service';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Category Management - HACKTOLIVE Academy";
  }, []);

  const fetchCategories = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setAllCategories(data);

      // Apply search filter
      let filteredData = data;
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((category: ProductCategory) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setCategories(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories', { description: 'Please try again' });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      order: 0,
      featured: false,
    });
    setShowModal(true);
  };

  const handleEdit = (category: ProductCategory) => {
    setSelectedCategory(category);
    setFormData(category);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.createCategory(formData);
        toast.success('Category created successfully!');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error: any) {
      toast.error('Failed to save category', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsSubmitting(true);
      await categoryService.deleteCategory(categoryToDelete.id);
      toast.success('Category deleted successfully!');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error: any) {
      toast.error('Failed to delete category', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setCategoryToDelete({ id, name });
    setShowDeleteModal(true);
  };

  if (loading) {
    return <TablePageLoadingSkeleton />;
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Category Management" />

      <div className="mt-4 sm:mt-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Category Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Manage your product categories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineCollection className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Categories</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {allCategories.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlineStar className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Featured</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {allCategories.filter(c => c.featured).length}
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
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Products</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {allCategories.reduce((sum, c) => sum + (c._count?.products || 0), 0)}
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
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
              <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Create, edit, and manage all categories
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30"
            >
              <HiOutlinePlus className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          {/* Search */}
          <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or slug... (Press Enter to search)"
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
                >
                  <HiOutlineX className="h-3.5 w-3.5" />
                </button>
              )}
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
                        Name
                      </span>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Slug
                      </span>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Products
                      </span>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Order
                      </span>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Featured
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
                  {categories.map((category) => (
                    <TableRow key={category.id} className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2">
                      <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </p>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {category.slug}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {category._count?.products || 0}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {category.order}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                        {category.featured ? (
                          <Badge color="success" variant="light">Yes</Badge>
                        ) : (
                          <Badge color="light" variant="light">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(category)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                            title="Edit category"
                          >
                            <HiOutlinePencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(category.id, category.name)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/15 dark:hover:text-error-500"
                            title="Delete category"
                          >
                            <HiOutlineTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-3 py-3 dark:border-white/5 sm:px-4">
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="h-8 rounded-lg border border-gray-300 bg-white px-2 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <HiOutlineChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <HiOutlineChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            {selectedCategory ? 'Edit Category' : 'Create Category'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">Featured Category</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button
              onClick={() => setShowModal(false)}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              className="bg-brand-500 text-white hover:bg-brand-600"
            >
              {isSubmitting ? 'Saving...' : selectedCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            Delete Category
          </h3>
          <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
              <HiOutlineExclamationCircle className="h-5 w-5 text-error-600 dark:text-error-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>?
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-error-500 text-white hover:bg-error-600"
            >
              {isSubmitting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </div>
        </div>
        </div>
      </Modal>
    </>
  );
}
