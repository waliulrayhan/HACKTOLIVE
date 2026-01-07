"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineArchive,
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
import { getFullImageUrl } from '@/lib/image-utils';
import { productService, categoryService, Product, ProductCategory } from '@/lib/shop-service';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Product Management - HACKTOLIVE Academy";
  }, []);

  const fetchProducts = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      // Admin panel should see all products regardless of status
      const response = await productService.getProducts({ limit: 1000, status: '' });
      const data = response.data || [];
      setAllProducts(data);

      // Apply filters
      let filteredData = data;
      if (statusFilter !== 'ALL') {
        filteredData = filteredData.filter((product: Product) => product.status === statusFilter);
      }
      if (typeFilter !== 'ALL') {
        filteredData = filteredData.filter((product: Product) => product.type === typeFilter);
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((product: Product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setProducts(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products', { description: 'Please try again' });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, typeFilter, searchTerm, itemsPerPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, itemsPerPage]);

  const handleCreate = () => {
    router.push('/admin/shop/products/create');
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/shop/products/${product.id}/edit`);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsSubmitting(true);
      await productService.deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully!');
      setShowDeleteModal(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to delete product', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'DRAFT': return 'warning';
      case 'ARCHIVED': return 'error';
      default: return 'light';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'COURSE_VOUCHER': return 'info';
      case 'TSHIRT': return 'success';
      case 'MERCHANDISE': return 'warning';
      case 'TRAINING_BUNDLE': return 'error';
      default: return 'light';
    }
  };

  if (loading) {
    return <TablePageLoadingSkeleton />;
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Product Management" />

      <div className="mt-4 sm:mt-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Manage your shop products and inventory
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineCube className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Products</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {allProducts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlineShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {allProducts.filter(p => p.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
                <HiOutlineTag className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Low Stock</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {allProducts.filter(p => p.stockQuantity < (p.lowStockThreshold || 10)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <HiOutlineArchive className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
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
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Products</h2>
              <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Create, edit, and manage all products
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30"
            >
              <HiOutlinePlus className="h-4 w-4" />
              Add Product
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, category, or SKU... (Press Enter to search)"
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="ALL">All Types</option>
                <option value="COURSE_VOUCHER">Course Voucher</option>
                <option value="TSHIRT">T-Shirt</option>
                <option value="MERCHANDISE">Merchandise</option>
                <option value="TRAINING_BUNDLE">Training Bundle</option>
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
                        Product
                      </span>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Type
                      </span>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Price
                      </span>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Stock
                      </span>
                    </TableCell>
                    <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                        Status
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
                  {products.map((product) => (
                    <TableRow key={product.id} className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2">
                      <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <div className="flex items-start gap-2">
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                            <img
                              src={getFullImageUrl(product.thumbnail || product.images?.[0], 'general') || '/images/placeholder.png'}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400">
                                {product.category?.name}
                              </span>
                              {product.featured && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <Badge color={getTypeBadgeColor(product.type)} variant="light">
                          {product.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          ৳{product.price.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                        <span className={`text-xs font-medium ${product.stockQuantity < (product.lowStockThreshold || 10) ? 'text-error-600 dark:text-error-500' : 'text-gray-900 dark:text-white'}`}>
                          {product.stockQuantity}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <Badge color={getStatusBadgeColor(product.status)} variant="light">
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                            title="Edit product"
                          >
                            <HiOutlinePencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product.id, product.name)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/15 dark:hover:text-error-500"
                            title="Delete product"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            Delete Product
          </h3>
          <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
              <HiOutlineExclamationCircle className="h-5 w-5 text-error-600 dark:text-error-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
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
              {isSubmitting ? 'Deleting...' : 'Delete Product'}
            </Button>
          </div>
        </div>
        </div>
      </Modal>
    </>
  );
}
