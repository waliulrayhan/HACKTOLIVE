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
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineExclamationCircle,
  HiOutlineEye,
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
    document.title = "Product Management - HackToLive Academy";
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
      case 'DAILY_SPECIAL': return 'success';
      case 'MERCHANDISE': return 'warning';
      case 'TRAINING_BUNDLE': return 'error';
      default: return 'light';
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Product Management" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Product Management" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineCube className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
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
              Manage your shop products and inventory
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600"
          >
            <HiOutlinePlus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
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
                <option value="DAILY_SPECIAL">Daily Special</option>
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
                          {product.price.toLocaleString()} BDT
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
                            className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-brand-500/15 dark:hover:text-brand-400"
                            title="Edit product"
                          >
                            <HiOutlinePencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product.id, product.name)}
                            className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/15 dark:hover:text-error-500"
                            title="Delete product"
                          >
                            <HiOutlineTrash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {products.length === 0 && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <HiOutlineCube className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">No products found</p>
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
                  <option value={100}>100</option>
                </select>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  of {pagination.total} results
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={pagination.page === 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  title="First page"
                >
                  <HiOutlineChevronDoubleLeft className="h-3 w-3" />
                </button>
                
                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  title="Previous page"
                >
                  <HiOutlineChevronLeft className="h-3 w-3" />
                </button>
                
                {/* Page Numbers */}
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
                        <span className="px-1 sm:px-2 text-gray-400 text-xs">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                          pagination.page === page
                            ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                
                {/* Next Page */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  title="Next page"
                >
                  <HiOutlineChevronRight className="h-3 w-3" />
                </button>
                
                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  title="Last page"
                >
                  <HiOutlineChevronDoubleRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Product
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
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{productToDelete.name}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone and will permanently remove this product from the system.
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
                onClick={handleDelete}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <HiOutlineTrash className="h-4 w-4" />
                    Delete Product
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
