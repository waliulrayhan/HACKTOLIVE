import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SslcommerzService } from './sslcommerz.service';
import { EmailService } from '../email/email.service';
import { CoursePaymentStatus } from '@prisma/client';

export interface InitiatePaymentDto {
  courseId?: string;
  productId?: string;
  cartItems?: Array<{
    productId: string;
    quantity: number;
    voucherCode?: string;
  }>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
  shippingPostalCode?: string;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sslcommerz: SslcommerzService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Initiate payment for course enrollment or shop checkout
   * @param userId - Optional user ID (for guest checkout)
   */
  async initiatePayment(userId: string | undefined, data: InitiatePaymentDto) {
    try {
      let amount = 0;
      let productName = '';
      let productCategory = '';
      let cartData: string | null = null;

      // Determine what user is paying for
      if (data.courseId) {
        const course = await this.prisma.course.findUnique({
          where: { id: data.courseId },
        });

        if (!course) {
          throw new NotFoundException('Course not found');
        }

        if (course.price === 0) {
          throw new BadRequestException('This course is free');
        }

        // Check if already enrolled (only for logged-in users)
        if (userId) {
          const existingEnrollment = await this.prisma.enrollment.findFirst({
            where: {
              student: { userId },
              courseId: data.courseId,
            },
          });

          if (existingEnrollment) {
            throw new BadRequestException('Already enrolled in this course');
          }
        }

        amount = course.price;
        productName = course.title;
        productCategory = 'Course Enrollment';
      } else if (data.cartItems && data.cartItems.length > 0) {
        // Shopping cart checkout
        let subtotal = 0;
        const items: Array<{
          productId: string;
          productName: string;
          productImage?: string | null;
          quantity: number;
          price: number;
          total: number;
          voucherCode?: string;
        }> = [];

        for (const item of data.cartItems) {
          const product = await this.prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new NotFoundException(`Product not found: ${item.productId}`);
          }

          // Check stock
          if (product.stockQuantity < item.quantity) {
            throw new BadRequestException(`Insufficient stock for ${product.name}`);
          }

          const itemTotal = product.price * item.quantity;
          subtotal += itemTotal;

          items.push({
            productId: product.id,
            productName: product.name,
            productImage: product.thumbnail || (product.images ? JSON.parse(product.images)[0] : null),
            quantity: item.quantity,
            price: product.price,
            total: itemTotal,
            voucherCode: item.voucherCode,
          });
        }

        // Calculate shipping (no tax, flat 100 BDT shipping)
        const tax = 0;
        const shippingCharge = 100;
        
        amount = subtotal + shippingCharge;
        productName = items.length === 1 ? items[0].productName : `Shopping Cart (${items.length} items)`;
        productCategory = 'Product Purchase';
        cartData = JSON.stringify({
          items,
          subtotal,
          tax,
          shippingCharge,
          total: amount,
          shippingAddress: data.shippingAddress,
          shippingCity: data.shippingCity,
          shippingCountry: data.shippingCountry,
          shippingZip: data.shippingPostalCode,
        });
      } else if (data.productId) {
        const product = await this.prisma.product.findUnique({
          where: { id: data.productId },
        });

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        amount = product.price;
        productName = product.name;
        productCategory = 'Product Purchase';
      } else {
        throw new BadRequestException('Either courseId, productId, or cartItems must be provided');
      }

      // Generate unique transaction ID
      const transactionId = this.sslcommerz.generateTransactionId();

      // Create payment record
      const payment = await this.prisma.coursePayment.create({
        data: {
          transactionId,
          amount,
          currency: 'BDT',
          status: CoursePaymentStatus.PENDING,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          customerCity: data.customerCity,
          customerCountry: data.customerCountry,
          courseId: data.courseId,
          productId: data.productId,
          metadata: cartData, // Store cart data for later order creation
        },
      });

      // Get frontend URL from environment
      const frontendBaseUrl = process.env.FRONTEND_URL?.split(',')[0] || 'http://localhost:3000';
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
      
      // Use network IP for callbacks (SSLCommerz sandbox requires publicly accessible URLs)
      const successUrl = process.env.PAYMENT_SUCCESS_URL || `${frontendBaseUrl}/payment/success`;
      const failUrl = process.env.PAYMENT_FAIL_URL || `${frontendBaseUrl}/payment/failed`;
      const cancelUrl = process.env.PAYMENT_CANCEL_URL || `${frontendBaseUrl}/payment/cancel`;

      // Initialize payment with SSLCommerz
      const paymentInit = await this.sslcommerz.initPayment({
        totalAmount: amount,
        currency: 'BDT',
        transactionId,
        productName,
        productCategory,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerCity: data.customerCity,
        customerCountry: data.customerCountry,
        successUrl: `${successUrl}?tran_id=${transactionId}`,
        failUrl: `${failUrl}?tran_id=${transactionId}`,
        cancelUrl: `${cancelUrl}?tran_id=${transactionId}`,
        ipnUrl: `${backendUrl}/payment/ipn`,
      });

      if (!paymentInit.success) {
        // Update payment status to failed
        await this.prisma.coursePayment.update({
          where: { id: payment.id },
          data: { status: CoursePaymentStatus.FAILED },
        });

        throw new BadRequestException(paymentInit.message || 'Failed to initialize payment');
      }

      this.logger.log(`Payment initiated: ${transactionId} for user: ${userId}`);

      return {
        success: true,
        paymentId: payment.id,
        transactionId,
        gatewayUrl: paymentInit.gatewayUrl,
        amount,
        currency: 'BDT',
      };
    } catch (error) {
      this.logger.error(`Error initiating payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Verify and validate payment - Simple version for sandbox
   */
  async verifyAndValidatePayment(transactionId: string) {
    const payment = await this.prisma.coursePayment.findUnique({
      where: { transactionId },
      include: { course: true, product: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Already completed
    if (payment.status === CoursePaymentStatus.COMPLETED) {
      return payment;
    }

    // Already failed/cancelled  
    if (payment.status === CoursePaymentStatus.FAILED || payment.status === CoursePaymentStatus.CANCELLED) {
      return payment;
    }

    // Mark as validated and complete
    await this.prisma.coursePayment.update({
      where: { id: payment.id },
      data: {
        status: CoursePaymentStatus.VALIDATED,
        validatedAt: new Date(),
        riskLevel: 0,
      },
    });

    await this.completePayment(payment.id);

    return this.prisma.coursePayment.findUnique({
      where: { id: payment.id },
      include: { course: true, product: true },
    });
  }

  /**
   * Handle IPN (Instant Payment Notification) from SSLCommerz
   */
  async handleIPN(ipnData: any) {
    try {
      const transactionId = ipnData.tran_id;
      
      this.logger.log(`Received IPN for transaction: ${transactionId}, status: ${ipnData.status}`);
      this.logger.log(`IPN Data:`, JSON.stringify(ipnData));

      // Find payment record
      const payment = await this.prisma.coursePayment.findUnique({
        where: { transactionId },
        include: { course: true, product: true },
      });

      if (!payment) {
        this.logger.warn(`Payment not found for transaction: ${transactionId}`);
        return { success: false, message: 'Payment not found' };
      }

      // CRITICAL: Check IPN status from SSLCommerz
      // SSLCommerz sends status in IPN: VALID, FAILED, CANCELLED, UNATTEMPTED, etc.
      const ipnStatus = ipnData.status?.toUpperCase();
      
      // If payment failed or was cancelled, mark it as such immediately
      if (ipnStatus === 'FAILED' || ipnStatus === 'CANCELLED' || ipnStatus === 'UNATTEMPTED') {
        this.logger.warn(`Payment ${ipnStatus.toLowerCase()} from SSLCommerz: ${transactionId}`);
        
        await this.prisma.coursePayment.update({
          where: { id: payment.id },
          data: {
            status: ipnStatus === 'CANCELLED' ? CoursePaymentStatus.CANCELLED : CoursePaymentStatus.FAILED,
            bankTransactionId: ipnData.bank_tran_id,
            cardType: ipnData.card_type,
            cardIssuer: ipnData.card_issuer,
            ipnData: JSON.stringify(ipnData),
          },
        });

        return { success: false, message: `Payment ${ipnStatus.toLowerCase()}` };
      }

      // Only proceed with validation if IPN status indicates success
      if (ipnStatus !== 'VALID' && ipnStatus !== 'VALIDATED') {
        this.logger.warn(`Unknown IPN status for ${transactionId}: ${ipnStatus}`);
        
        await this.prisma.coursePayment.update({
          where: { id: payment.id },
          data: {
            status: CoursePaymentStatus.PROCESSING,
            ipnData: JSON.stringify(ipnData),
          },
        });

        return { success: false, message: 'Unknown payment status' };
      }

      // Update payment with IPN data
      await this.prisma.coursePayment.update({
        where: { id: payment.id },
        data: {
          status: CoursePaymentStatus.PROCESSING,
          bankTransactionId: ipnData.bank_tran_id,
          cardType: ipnData.card_type,
          cardIssuer: ipnData.card_issuer,
          cardBrand: ipnData.card_brand,
          cardSubBrand: ipnData.card_sub_brand,
          storeAmount: parseFloat(ipnData.store_amount || '0'),
          ipnData: JSON.stringify(ipnData),
        },
      });

      // Validate payment with SSLCommerz
      const validation = await this.sslcommerz.validatePayment(
        ipnData.val_id || transactionId,
        payment.amount,
        payment.currency,
      );

      if (validation.isValid) {
        // Check risk level
        const riskLevel = parseInt(ipnData.risk_level || '0');
        
        await this.prisma.coursePayment.update({
          where: { id: payment.id },
          data: {
            status: CoursePaymentStatus.VALIDATED,
            validatedAt: new Date(),
            riskLevel,
            riskTitle: ipnData.risk_title,
          },
        });

        // If low risk, complete the enrollment/order
        if (riskLevel === 0) {
          await this.completePayment(payment.id);
        } else {
          this.logger.warn(`High risk payment detected: ${transactionId}, risk level: ${riskLevel}`);
        }

        return { success: true, message: 'Payment validated successfully' };
      } else {
        await this.prisma.coursePayment.update({
          where: { id: payment.id },
          data: { status: CoursePaymentStatus.FAILED },
        });

        this.logger.error(`Payment validation failed for: ${transactionId}`);
        return { success: false, message: 'Payment validation failed' };
      }
    } catch (error) {
      this.logger.error(`Error handling IPN: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Complete payment and create enrollment/order
   */
  async completePayment(paymentId: string) {
    try {
      const payment = await this.prisma.coursePayment.findUnique({
        where: { id: paymentId },
        include: { course: true, product: true },
      });

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.status === CoursePaymentStatus.COMPLETED) {
        this.logger.log(`Payment already completed: ${paymentId}`);
        return { success: true, message: 'Payment already completed' };
      }

      // SECURITY CHECK: Only complete validated payments with low risk
      if (payment.status !== CoursePaymentStatus.VALIDATED) {
        this.logger.warn(`Cannot complete payment ${paymentId}: Status is ${payment.status}, expected VALIDATED`);
        throw new BadRequestException(`Payment is not validated. Current status: ${payment.status}`);
      }

      if (payment.riskLevel > 0) {
        this.logger.warn(`Cannot auto-complete high-risk payment ${paymentId}: Risk level ${payment.riskLevel}`);
        throw new BadRequestException(`Payment has risk level ${payment.riskLevel}. Manual review required.`);
      }

      // Get user by email (optional for guest checkout)
      const user = await this.prisma.user.findUnique({
        where: { email: payment.customerEmail },
        include: { student: true },
      });

      // Handle course enrollment (requires user account)
      if (payment.courseId) {
        if (!user || !user.student) {
          throw new NotFoundException('Student account required for course enrollment. Please sign up first.');
        }

        const enrollment = await this.prisma.enrollment.create({
          data: {
            studentId: user.student.id,
            courseId: payment.courseId,
            paymentId: payment.id,
          },
        });

        // Update course enrolled students count
        await this.prisma.course.update({
          where: { id: payment.courseId },
          data: {
            enrolledStudents: { increment: 1 },
            totalStudents: { increment: 1 },
          },
        });

        // Update student stats
        await this.prisma.student.update({
          where: { id: user.student.id },
          data: {
            enrolledCourses: { increment: 1 },
          },
        });

        // Update instructor stats if instructor exists
        if (payment.course?.instructorId) {
          await this.prisma.instructor.update({
            where: { id: payment.course.instructorId },
            data: {
              totalStudents: { increment: 1 },
            },
          });
        }

        // Get instructor name for email
        let instructorName = 'HACKTOLIVE Instructor';
        if (payment.course?.instructorId) {
          const instructor = await this.prisma.instructor.findUnique({
            where: { id: payment.course.instructorId },
            include: { user: true },
          });
          instructorName = instructor?.user?.name || instructorName;
        }

        // Send enrollment confirmation email (non-blocking)
        if (user.email && payment.course) {
          this.logger.log(`📧 Sending enrollment confirmation email to ${user.email} for course: ${payment.course.title}`);
          this.emailService.sendCourseEnrollmentConfirmation(
            user.email,
            user.name || 'Student',
            payment.course.title,
            payment.course.slug,
            instructorName,
            false, // Paid course
          ).then((sent) => {
            if (sent) {
              this.logger.log(`✅ Enrollment confirmation email sent successfully to ${user.email}`);
            } else {
              this.logger.error(`❌ Failed to send enrollment confirmation email to ${user.email}`);
            }
          }).catch(error => {
            this.logger.error('❌ Error sending enrollment confirmation email:', error);
          });
        } else {
          this.logger.warn(`⚠️ No email address found for user ${user.id}, skipping enrollment confirmation email`);
        }

        this.logger.log(`Enrollment created: ${enrollment.id} for payment: ${paymentId}`);
      }

      // Handle shop order from cart
      if (payment.metadata) {
        try {
          const cartData = JSON.parse(payment.metadata);
          
          // Create order
          const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          const order = await this.prisma.order.create({
            data: {
              orderNumber,
              userId: user?.id, // Optional - guest checkout allowed
              customerName: payment.customerName,
              customerEmail: payment.customerEmail,
              customerPhone: payment.customerPhone || '',
              shippingAddress: cartData.shippingAddress || payment.customerAddress || '',
              shippingCity: cartData.shippingCity || payment.customerCity || '',
              shippingCountry: cartData.shippingCountry || payment.customerCountry || '',
              shippingZip: cartData.shippingZip || '',
              paymentMethod: payment.paymentMethod as any || 'CARD',
              paymentStatus: 'COMPLETED',
              status: 'PENDING',
              transactionId: payment.transactionId, // Store SSLCommerz transaction ID
              subtotal: cartData.subtotal,
              tax: cartData.tax,
              shippingCost: cartData.shippingCharge,
              total: cartData.total,
              items: {
                create: cartData.items.map((item: any) => ({
                  productId: item.productId,
                  productName: item.productName,
                  productImage: item.productImage,
                  quantity: item.quantity,
                  price: item.price,
                  total: item.total,
                  voucherCode: item.voucherCode,
                })),
              },
            },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          });

          // Update product stock
          for (const item of cartData.items) {
            await this.prisma.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: { decrement: item.quantity },
              },
            });
          }

          // Send order confirmation email
          if (payment.customerEmail) {
            this.logger.log(`📧 Sending order confirmation email to ${payment.customerEmail}`);
            // TODO: Implement order confirmation email
            // this.emailService.sendOrderConfirmation(...)
          }

          this.logger.log(`Shop order created: ${order.id} from payment: ${paymentId}`);
        } catch (error) {
          this.logger.error(`Error creating shop order: ${error.message}`, error.stack);
          throw new BadRequestException(`Failed to create order: ${error.message}`);
        }
      }

      // Update payment status
      await this.prisma.coursePayment.update({
        where: { id: paymentId },
        data: { status: CoursePaymentStatus.COMPLETED },
      });

      // Send payment receipt email (non-blocking)
      const receiptEmail = payment.customerEmail;
      if (receiptEmail) {
        this.logger.log(`📧 Sending payment receipt to ${receiptEmail}`);
        const courseName = payment.course?.title || payment.product?.name || 'Product/Service';
        const customerName = payment.customerName;
        this.emailService.sendPaymentReceipt(
          receiptEmail,
          customerName,
          payment.transactionId,
          payment.amount,
          payment.currency,
          courseName,
          payment.paymentMethod || 'SSLCommerz',
          payment.cardType || undefined,
          payment.cardIssuer || undefined,
          payment.bankTransactionId || undefined,
        ).then((sent) => {
          if (sent) {
            this.logger.log(`✅ Payment receipt sent successfully to ${receiptEmail}`);
          } else {
            this.logger.error(`❌ Failed to send payment receipt to ${receiptEmail}`);
          }
        }).catch(error => {
          this.logger.error('❌ Error sending payment receipt:', error);
        });
      }

      this.logger.log(`Payment completed: ${paymentId}`);

      return { success: true, message: 'Payment completed successfully' };
    } catch (error) {
      this.logger.error(`Error completing payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get payment details
   */
  async getPayment(transactionId: string) {
    const payment = await this.prisma.coursePayment.findUnique({
      where: { transactionId },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  /**
   * Get all payments (Admin only)
   */
  async getAllPayments(page = 1, limit = 20, status?: CoursePaymentStatus) {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [payments, total] = await Promise.all([
      this.prisma.coursePayment.findMany({
        where,
        include: {
          course: { select: { id: true, title: true } },
          product: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.coursePayment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get payment statistics (Admin only)
   */
  async getPaymentStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      total,
      completed,
      pending,
      processing,
      validated,
      failed,
      totalRevenue,
      todayRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      this.prisma.coursePayment.count(),
      this.prisma.coursePayment.count({ where: { status: CoursePaymentStatus.COMPLETED } }),
      this.prisma.coursePayment.count({ where: { status: CoursePaymentStatus.PENDING } }),
      this.prisma.coursePayment.count({ where: { status: CoursePaymentStatus.PROCESSING } }),
      this.prisma.coursePayment.count({ where: { status: CoursePaymentStatus.VALIDATED } }),
      this.prisma.coursePayment.count({ 
        where: { 
          status: { in: [CoursePaymentStatus.FAILED, CoursePaymentStatus.CANCELLED] } 
        } 
      }),
      this.prisma.coursePayment.aggregate({
        where: { status: CoursePaymentStatus.COMPLETED },
        _sum: { amount: true },
      }),
      this.prisma.coursePayment.aggregate({
        where: {
          status: CoursePaymentStatus.COMPLETED,
          createdAt: { gte: today },
        },
        _sum: { amount: true },
      }),
      this.prisma.coursePayment.aggregate({
        where: {
          status: CoursePaymentStatus.COMPLETED,
          createdAt: { gte: firstDayOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      total,
      completed,
      pending,
      processing,
      validated,
      failed,
      totalRevenue: totalRevenue._sum.amount || 0,
      todayRevenue: todayRevenue._sum.amount || 0,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
    };
  }
}
