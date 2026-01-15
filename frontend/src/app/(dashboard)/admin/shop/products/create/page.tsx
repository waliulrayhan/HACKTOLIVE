"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import ImageCropper from "@/components/ImageCropper";
import { productService, categoryService, ProductCategory } from '@/lib/shop-service';
import { academyService } from '@/lib/academy-service';
import type { Course } from '@/types/academy';
import {
  HiOutlineInformationCircle,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineCamera,
  HiOutlineCog,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePhotograph,
  HiOutlineGift,
} from "react-icons/hi";

export default function CreateProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    type: "MERCHANDISE" as 'COURSE_VOUCHER' | 'DAILY_SPECIAL' | 'MERCHANDISE' | 'TRAINING_BUNDLE',
    price: 0,
    compareAtPrice: 0,
    sku: "",
    images: [] as string[],
    thumbnail: "",
    stockQuantity: 0,
    lowStockThreshold: 10,
    trackInventory: true,
    allowBackorder: false,
    weight: 0,
    featured: false,
    status: "DRAFT" as const,
    seoTitle: "",
    seoDescription: "",
    tags: "",
    // Type-specific fields
    courseId: "",
    voucherDuration: 1, // in months
    sizes: [] as string[],
    colors: [] as string[],
    material: "",
    bundleProducts: [] as string[],
  });

  useEffect(() => {
    document.title = "Create Product - HACKTOLIVE Academy";
    fetchCategories();
    fetchCourses();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await academyService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: HiOutlineInformationCircle },
    { number: 2, title: "Pricing & Inventory", icon: HiOutlineCurrencyDollar },
    { number: 3, title: "Review", icon: HiOutlineCheckCircle },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }

    // Clear errors
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleImageClick = (index?: number) => {
    setCurrentImageIndex(index ?? null);
    imageInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setImageToCrop(null);
    setUploadingImage(true);
    
    try {
      const file = new File([croppedBlob], 'product-image.jpg', { type: 'image/jpeg' });
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      if (currentImageIndex !== null && currentImageIndex < formData.images.length) {
        // Replace existing image
        const newImages = [...formData.images];
        newImages[currentImageIndex] = data.imageUrl;
        setFormData(prev => ({ 
          ...prev, 
          images: newImages,
          thumbnail: currentImageIndex === 0 ? data.imageUrl : prev.thumbnail 
        }));
      } else {
        // Add new image
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, data.imageUrl],
          thumbnail: prev.images.length === 0 ? data.imageUrl : prev.thumbnail
        }));
      }
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      setCurrentImageIndex(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ 
      ...prev, 
      images: newImages,
      thumbnail: index === 0 ? (newImages[0] || '') : prev.thumbnail
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.slug.trim()) newErrors.slug = "Slug is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.categoryId) newErrors.categoryId = "Category is required";
      if (!formData.type) newErrors.type = "Type is required";
    }

    if (step === 2) {
      if (formData.price < 0) newErrors.price = "Price must be 0 or greater";
      if (formData.stockQuantity < 0) newErrors.stockQuantity = "Stock quantity must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        sizes: formData.type === 'DAILY_SPECIAL' || formData.type === 'MERCHANDISE' ? formData.sizes : undefined,
        colors: formData.type === 'DAILY_SPECIAL' || formData.type === 'MERCHANDISE' ? formData.colors : undefined,
        material: formData.type === 'DAILY_SPECIAL' || formData.type === 'MERCHANDISE' ? formData.material : undefined,
        courseId: formData.type === 'COURSE_VOUCHER' ? (formData.courseId || undefined) : undefined,
        voucherDuration: formData.type === 'COURSE_VOUCHER' ? (formData.voucherDuration * 30) : undefined, // Convert months to days
        bundleProducts: formData.type === 'TRAINING_BUNDLE' ? formData.bundleProducts : undefined,
      };

      await productService.createProduct(productData);
      
      toast.success('Product created successfully!');
      router.push('/admin/shop/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Create Product" />

      {/* Progress Steps */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    currentStep >= step.number
                      ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                      : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800'
                  }`}
                >
                  {currentStep > step.number ? (
                    <HiOutlineCheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <p className={`mt-2 text-[10px] sm:text-xs font-medium text-center ${
                  currentStep >= step.number
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors ${
                    currentStep > step.number
                      ? 'bg-brand-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineShoppingBag className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Product Basic Information
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Provide essential details about your product
                </p>
              </div>
            </div>

            {/* Product Images */}
            <div className="rounded-xl border border-gray-200 bg-linear-to-br from-gray-50 to-white p-5 dark:border-white/5 dark:from-gray-800/50 dark:to-gray-900/50">
              <label className="flex text-sm font-semibold text-gray-900 dark:text-white mb-3 items-center gap-2">
                <HiOutlinePhotograph className="h-4 w-4 text-brand-500" />
                Product Images
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Add up to 5 images)</span>
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full aspect-square overflow-hidden border-2 border-gray-300 rounded-lg dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                      <Image
                        width={200}
                        height={200}
                        src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                        alt={`Product image ${index + 1}`}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-brand-500 text-white text-[10px] font-semibold rounded">
                          Primary
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleImageClick(index)}
                        className="p-1.5 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Replace image"
                      >
                        <HiOutlineCamera className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1.5 bg-white text-red-600 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        title="Remove image"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {formData.images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => handleImageClick()}
                    disabled={uploadingImage}
                    className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <HiOutlinePlus className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-500">Add Image</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                📸 Recommended: 1:1 ratio, max 5MB per image, JPG/PNG/WebP
              </p>
            </div>

            {/* Basic Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HiOutlineInformationCircle className="h-4 w-4 text-brand-500" />
                Basic Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    }`}
                    placeholder="e.g., HACKTOLIVE Premium T-Shirt"
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug (URL-friendly) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <HiOutlineTag className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`w-full h-10 rounded-lg border pl-10 pr-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                        errors.slug
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      }`}
                      placeholder="hacktolive-premium-tshirt"
                    />
                  </div>
                  {errors.slug && <p className="mt-1.5 text-xs text-red-500">{errors.slug}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white ${
                      errors.categoryId
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-brand-500 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="mt-1.5 text-xs text-red-500">{errors.categoryId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white ${
                      errors.type
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-brand-500 dark:border-gray-600'
                    }`}
                  >
                    <option value="MERCHANDISE">Merchandise</option>
                    <option value="DAILY_SPECIAL">Daily Special</option>
                    <option value="COURSE_VOUCHER">Course Voucher</option>
                    <option value="TRAINING_BUNDLE">Training Bundle</option>
                  </select>
                  {errors.type && <p className="mt-1.5 text-xs text-red-500">{errors.type}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={3}
                    maxLength={500}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Brief overview (2-3 sentences)"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.shortDescription.length}/500 characters
                  </p>
                </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    errors.description
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  }`}
                  placeholder="Detailed product description..."
                />
                {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
              </div>
              </div>
            </div>

            {/* Product Settings */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <HiOutlineCog className="h-4 w-4 text-purple-500" />
                Product Settings
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="cybersecurity, merchandise, limited-edition"
                  />
                </div>

                <div className="md:col-span-2 flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Featured Product</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Inventory */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlineCurrencyDollar className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Pricing & Inventory
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Set pricing and manage stock levels
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Pricing</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      errors.price
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    }`}
                  />
                  {errors.price && <p className="mt-1.5 text-xs text-red-500">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compare At Price (৳)
                  </label>
                  <input
                    type="number"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Original price"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Inventory</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full h-10 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                      errors.stockQuantity
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    }`}
                  />
                  {errors.stockQuantity && <p className="mt-1.5 text-xs text-red-500">{errors.stockQuantity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Type-Specific Fields */}
            {formData.type === 'COURSE_VOUCHER' && (
              <div className="rounded-xl border border-gray-200 bg-linear-to-br from-green-50 to-white p-5 dark:border-white/5 dark:from-green-900/20 dark:to-gray-900/50">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiOutlineGift className="h-4 w-4 text-green-500" />
                  Voucher Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course (Optional)
                    </label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">All Courses (General Voucher)</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Leave as "All Courses" for a general voucher
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Voucher Duration (months)
                    </label>
                    <input
                      type="number"
                      name="voucherDuration"
                      value={formData.voucherDuration}
                      onChange={handleInputChange}
                      min="1"
                      max="12"
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., 1, 3, 6, 12"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Duration in months (1-12 months)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(formData.type === 'MERCHANDISE' || formData.type === 'DAILY_SPECIAL') && (
              <div className="rounded-xl border border-gray-200 bg-linear-to-br from-purple-50 to-white p-5 dark:border-white/5 dark:from-purple-900/20 dark:to-gray-900/50">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiOutlineTag className="h-4 w-4 text-purple-500" />
                  Merchandise Options
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.sizes.join(', ')}
                      onChange={(e) => {
                        const sizes = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                        setFormData(prev => ({ ...prev, sizes }));
                      }}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="XS, S, M, L, XL, XXL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available Colors (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.colors.join(', ')}
                      onChange={(e) => {
                        const colors = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                        setFormData(prev => ({ ...prev, colors }));
                      }}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Black, White, Red, Blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., 100% Cotton, Polyester Blend"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'TRAINING_BUNDLE' && (
              <div className="rounded-xl border border-gray-200 bg-linear-to-br from-blue-50 to-white p-5 dark:border-white/5 dark:from-blue-900/20 dark:to-gray-900/50">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiOutlineShoppingBag className="h-4 w-4 text-blue-500" />
                  Bundle Configuration
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bundle Product IDs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.bundleProducts.join(', ')}
                    onChange={(e) => {
                      const bundleProducts = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                      setFormData(prev => ({ ...prev, bundleProducts }));
                    }}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="product-id-1, product-id-2, product-id-3"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter product IDs that are included in this bundle
                  </p>
                </div>
              </div>
            )}

            {/* SEO Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">SEO (Optional)</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Product name - HACKTOLIVE Academy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Meta description for search engines..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <HiOutlineCheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Review & Submit
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Review all details before creating the product
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Product Summary</h4>
              
              <div className="space-y-4">
                <div className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  {formData.images.length > 0 && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                      <Image
                        width={96}
                        height={96}
                        src={`${process.env.NEXT_PUBLIC_API_URL}${formData.images[0]}`}
                        alt={formData.name}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="text-base font-semibold text-gray-900 dark:text-white">{formData.name || 'Untitled Product'}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{formData.shortDescription}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 text-xs rounded bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                        {formData.type.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400">
                        {categories.find(c => c.id === formData.categoryId)?.name || 'No Category'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">৳{formData.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{formData.stockQuantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{formData.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Images</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{formData.images.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-500/10 dark:border-red-500/20">
                <div className="flex gap-3">
                  <HiOutlineInformationCircle className="h-5 w-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">Please fix the following errors:</h4>
                    <ul className="mt-2 text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                      {Object.entries(errors).map(([key, value]) => (
                        <li key={key}>{value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-brand-500 text-white hover:bg-brand-600"
            >
              Next
              <HiOutlineArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-brand-500 text-white hover:bg-brand-600"
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
              <HiOutlineCheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setImageToCrop(null);
            setCurrentImageIndex(null);
          }}
          aspectRatio={1}
        />
      )}
    </div>
  );
}
