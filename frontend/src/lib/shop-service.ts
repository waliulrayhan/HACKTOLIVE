import api from './api-client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  category?: ProductCategory;
  type: 'COURSE_VOUCHER' | 'TSHIRT' | 'MERCHANDISE' | 'TRAINING_BUNDLE';
  price: number;
  compareAtPrice?: number;
  sku?: string;
  images: string[];
  thumbnail?: string;
  stockQuantity: number;
  lowStockThreshold?: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  courseId?: string;
  course?: any;
  voucherDuration?: number;
  sizes?: string[];
  colors?: string[];
  material?: string;
  bundleProducts?: string[];
  featured: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'OUT_OF_STOCK';
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  reviews?: ProductReview[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  featured: boolean;
  order: number;
  _count?: {
    products: number;
  };
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  selectedOptions?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState?: string;
  shippingZip: string;
  shippingCountry: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod?: 'MOBILE_BANKING' | 'CARD' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  notes?: string;
  trackingNumber?: string;
  items: OrderItem[];
  payments?: Payment[];
  invoice?: Invoice;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
  selectedOptions?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  voucherCode?: string;
  voucherUsed: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: 'MOBILE_BANKING' | 'CARD' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  mobileNumber?: string;
  mobileProvider?: string;
  cardLast4?: string;
  cardBrand?: string;
  bankName?: string;
  accountNumber?: string;
  transferReference?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  invoiceUrl?: string;
  issuedAt: string;
  dueAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Product APIs
export const productService = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
    sort?: string;
    order?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/shop/products', { params });
    return response.data;
  },

  getProductBySlug: async (slug: string) => {
    const response = await api.get(`/shop/products/slug/${slug}`);
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/shop/products/${id}`);
    return response.data;
  },

  createProduct: async (data: any) => {
    const response = await api.post('/admin/shop/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: any) => {
    const response = await api.put(`/admin/shop/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/admin/shop/products/${id}`);
    return response.data;
  },
};

// Category APIs
export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/shop/categories');
    return response.data;
  },

  getCategoryBySlug: async (slug: string) => {
    const response = await api.get(`/shop/categories/slug/${slug}`);
    return response.data;
  },

  createCategory: async (data: any) => {
    const response = await api.post('/admin/shop/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: any) => {
    const response = await api.put(`/admin/shop/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/admin/shop/categories/${id}`);
    return response.data;
  },
};

// Cart APIs
export const cartService = {
  // Helper to get sessionId from localStorage
  getSessionId: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('cart_session_id');
  },

  // Helper to save sessionId to localStorage
  saveSessionId: (sessionId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart_session_id', sessionId);
  },

  // Helper to clear sessionId from localStorage
  clearSessionId: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('cart_session_id');
  },

  getCart: async () => {
    const sessionId = cartService.getSessionId();
    const response = await api.get('/shop/cart', {
      params: { sessionId },
    });
    
    // Save sessionId if returned
    if (response.data?.sessionId) {
      cartService.saveSessionId(response.data.sessionId);
    }
    
    return response.data;
  },

  addToCart: async (data: {
    productId: string;
    quantity: number;
    selectedOptions?: any;
  }) => {
    const sessionId = cartService.getSessionId();
    const response = await api.post('/shop/cart/add', {
      ...data,
      sessionId,
    });
    
    // Save sessionId if returned from server
    if (response.data?.sessionId) {
      cartService.saveSessionId(response.data.sessionId);
    }
    
    return response.data;
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const sessionId = cartService.getSessionId();
    const response = await api.put(`/shop/cart/items/${itemId}`, { 
      quantity,
      sessionId,
    });
    return response.data;
  },

  removeFromCart: async (itemId: string) => {
    const sessionId = cartService.getSessionId();
    const response = await api.delete(`/shop/cart/items/${itemId}`, {
      data: { sessionId },
    });
    return response.data;
  },

  clearCart: async () => {
    const sessionId = cartService.getSessionId();
    const response = await api.delete('/shop/cart/clear', {
      data: { sessionId },
    });
    return response.data;
  },

  mergeCart: async () => {
    const sessionId = cartService.getSessionId();
    const response = await api.post('/shop/cart/merge', { sessionId });
    
    // Clear sessionId after merge since it's now associated with user
    cartService.clearSessionId();
    
    return response.data;
  },
};

// Order APIs
export const orderService = {
  createOrder: async (data: {
    customerEmail: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState?: string;
    shippingZip: string;
    shippingCountry: string;
    billingAddress?: string;
    billingCity?: string;
    billingState?: string;
    billingZip?: string;
    billingCountry?: string;
    paymentMethod: 'MOBILE_BANKING' | 'CARD' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
    notes?: string;
    sessionId?: string;
  }) => {
    const sessionId = cartService.getSessionId();
    const response = await api.post('/shop/orders', { ...data, sessionId });
    return response.data;
  },

  getMyOrders: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/shop/orders/my-orders', { params });
    return response.data;
  },

  getAllOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
  }) => {
    const response = await api.get('/admin/shop/orders', { params });
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get(`/shop/orders/${id}`);
    return response.data;
  },

  getOrderByNumber: async (orderNumber: string) => {
    const response = await api.get(`/shop/orders/number/${orderNumber}`);
    return response.data;
  },

  updateOrderStatus: async (
    id: string,
    data: {
      status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
      trackingNumber?: string;
      notes?: string;
    }
  ) => {
    const response = await api.put(`/admin/shop/orders/${id}/status`, data);
    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await api.put(`/shop/orders/${id}/cancel`);
    return response.data;
  },

  createPayment: async (data: {
    orderId: string;
    amount: number;
    paymentMethod: 'MOBILE_BANKING' | 'CARD' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
    mobileNumber?: string;
    mobileProvider?: string;
    cardToken?: string;
    bankName?: string;
    accountNumber?: string;
    transferReference?: string;
  }) => {
    const response = await api.post('/shop/orders/payments', data);
    return response.data;
  },

  confirmPayment: async (paymentId: string, transactionId: string) => {
    const response = await api.post(`/shop/orders/payments/${paymentId}/confirm`, { transactionId });
    return response.data;
  },

  generateInvoice: async (orderId: string) => {
    const response = await api.post(`/shop/orders/${orderId}/invoice`);
    return response.data;
  },
};
