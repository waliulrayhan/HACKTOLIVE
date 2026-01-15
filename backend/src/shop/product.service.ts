import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Product CRUD
  async createProduct(createProductDto: CreateProductDto) {
    const { images, sizes, colors, bundleProducts, tags, dimensions, ...data } = createProductDto;

    // Check if slug already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingProduct) {
      throw new BadRequestException('A product with this slug already exists. Please use a different name.');
    }

    // Auto-generate SKU if not provided
    if (!data.sku) {
      // Find the highest SKU number to avoid collisions
      const lastProduct = await this.prisma.product.findFirst({
        where: {
          sku: {
            startsWith: 'PROD-',
          },
        },
        orderBy: {
          sku: 'desc',
        },
        select: {
          sku: true,
        },
      });

      let nextNumber = 1;
      if (lastProduct?.sku) {
        const match = lastProduct.sku.match(/PROD-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      data.sku = `PROD-${String(nextNumber).padStart(5, '0')}`;
    }

    // Clean up empty or invalid values for optional foreign keys
    if (!data.courseId || data.courseId === '' || data.courseId === 'undefined') {
      delete data.courseId;
    }

    return this.prisma.product.create({
      data: {
        ...data,
        images: JSON.stringify(images || []),
        sizes: sizes ? JSON.stringify(sizes) : null,
        colors: colors ? JSON.stringify(colors) : null,
        bundleProducts: bundleProducts ? JSON.stringify(bundleProducts) : null,
        tags: tags ? JSON.stringify(tags) : null,
        dimensions: dimensions ? JSON.stringify(dimensions) : null,
      },
      include: {
        category: true,
        course: true,
      },
    });
  }

  async findAllProducts(query: any = {}) {
    const {
      page = 1,
      limit = 12,
      category,
      type,
      status,
      minPrice,
      maxPrice,
      search,
      featured,
      sort = 'createdAt',
      order = 'desc',
    } = query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where: any = {};

    if (category) {
      where.categoryId = category;
    }

    if (type) {
      // Handle multiple types separated by comma
      if (type.includes(',')) {
        const types = type.split(',').map((t: string) => t.trim());
        where.type = { in: types };
      } else {
        where.type = type;
      }
    }

    // Only filter by status if explicitly provided (allow empty string to show all)
    if (status && status !== '') {
      where.status = status;
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { [sort]: order },
        include: {
          category: true,
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((product) => this.formatProduct(product));

    return {
      data: formattedProducts,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        course: true,
        reviews: {
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
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  async findProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        course: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const { images, sizes, colors, bundleProducts, tags, dimensions, ...data } = updateProductDto;

    const updateData: any = { ...data };

    if (images) updateData.images = JSON.stringify(images);
    if (sizes) updateData.sizes = JSON.stringify(sizes);
    if (colors) updateData.colors = JSON.stringify(colors);
    if (bundleProducts) updateData.bundleProducts = JSON.stringify(bundleProducts);
    if (tags) updateData.tags = JSON.stringify(tags);
    if (dimensions) updateData.dimensions = JSON.stringify(dimensions);

    // Clean up empty or invalid values for optional foreign keys
    if (!updateData.courseId || updateData.courseId === '' || updateData.courseId === 'undefined') {
      updateData.courseId = null;
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        course: true,
      },
    });

    return this.formatProduct(product);
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.trackInventory) {
      return true;
    }

    if (product.allowBackorder) {
      return true;
    }

    return product.stockQuantity >= quantity;
  }

  async reduceStock(productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.trackInventory) {
      return;
    }

    const newStock = product.stockQuantity - quantity;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: newStock,
        status: newStock <= 0 && !product.allowBackorder ? 'OUT_OF_STOCK' : product.status,
      },
    });
  }

  async increaseStock(productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.trackInventory) {
      return;
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: product.stockQuantity + quantity,
        status: product.status === 'OUT_OF_STOCK' ? 'ACTIVE' : product.status,
      },
    });
  }

  // Category CRUD
  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.prisma.productCategory.create({
      data: createCategoryDto,
    });
  }

  async findAllCategories() {
    return this.prisma.productCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findCategoryBySlug(slug: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.productCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: string) {
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new BadRequestException('Cannot delete category with existing products');
    }

    return this.prisma.productCategory.delete({
      where: { id },
    });
  }

  // Helper method to format product
  private formatProduct(product: any) {
    return {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : null,
      colors: product.colors ? JSON.parse(product.colors) : null,
      bundleProducts: product.bundleProducts ? JSON.parse(product.bundleProducts) : null,
      tags: product.tags ? JSON.parse(product.tags) : null,
      dimensions: product.dimensions ? JSON.parse(product.dimensions) : null,
    };
  }
}
