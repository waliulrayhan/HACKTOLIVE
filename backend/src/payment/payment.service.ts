import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EpsService } from './eps.service';
import { EmailService } from '../email/email.service';
import { CourseCouponDiscountType, CoursePaymentStatus } from '@prisma/client';
import { getCourseFinalPrice } from '../utils/transform.util';

export interface InitiatePaymentDto {
  courseId?: string;
  couponCode?: string;
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
    private readonly eps: EpsService,
    private readonly emailService: EmailService,
  ) {
    this.logger.log('Payment gateway configured: EPS');
  }

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
      let courseOriginalAmount: number | null = null;
      let appliedCouponId: string | null = null;
      let couponDiscountAmount = 0;

      // Determine what user is paying for
      if (data.courseId) {
        const course = await this.prisma.course.findUnique({
          where: { id: data.courseId },
        });

        if (!course) {
          throw new NotFoundException('Course not found');
        }

        if ((course as any).ctaText === 'COMING_SOON') {
          throw new BadRequestException('Enrollment is not open yet for this course');
        }

        const finalCoursePrice = getCourseFinalPrice(course);

        if (finalCoursePrice === 0) {
          throw new BadRequestException('This course is free');
        }

        // SECURITY: Course enrollment requires user account - check BEFORE payment
        if (!userId) {
          throw new BadRequestException('Please login or signup before purchasing a course. Course enrollment requires an active student account.');
        }

        // Verify user has student account
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          include: { student: true },
        });

        if (!user || !user.student) {
          throw new BadRequestException('Student account required. Please complete your profile registration.');
        }

        // Check if already enrolled
        const existingEnrollment = await this.prisma.enrollment.findFirst({
          where: {
            studentId: user.student.id,
            courseId: data.courseId,
          },
        });

        if (existingEnrollment) {
          throw new BadRequestException('Already enrolled in this course');
        }

        courseOriginalAmount = finalCoursePrice;

        const couponPricing = await this.resolveCourseCouponPricing(
          data.courseId,
          finalCoursePrice,
          data.couponCode,
          user?.student?.id,
        );

        amount = couponPricing.finalAmount;
        productName = course.title;
        productCategory = 'Course Enrollment';

        if (amount < 1) {
          throw new BadRequestException('This coupon reduces payable amount below the minimum payment amount (1 BDT). Please use a smaller coupon.');
        }

        if (couponPricing.appliedCoupon) {
          data.couponCode = couponPricing.appliedCoupon.code;
          appliedCouponId = couponPricing.appliedCoupon.id;
          couponDiscountAmount = couponPricing.discountAmount;
        }
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
      const transactionId = this.eps.generateTransactionId();

      // Create payment record
      const payment = await this.prisma.coursePayment.create({
        data: {
          transactionId,
          amount,
          currency: 'BDT',
          status: CoursePaymentStatus.PENDING,
          paymentMethod: 'EPS',
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          customerCity: data.customerCity,
          customerCountry: data.customerCountry,
          courseId: data.courseId,
          productId: data.productId,
          couponId: data.courseId ? appliedCouponId : null,
          couponCode: data.couponCode ? data.couponCode.trim().toUpperCase() : null,
          originalAmount: data.courseId ? courseOriginalAmount : null,
          couponDiscountAmount: data.courseId ? couponDiscountAmount : 0,
          metadata: cartData, // Store cart data for later order creation
        },
      });

      // Get frontend URL from environment
      const frontendBaseUrl = process.env.FRONTEND_URL?.split(',')[0] || 'http://localhost:3000';
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
      
      // Use network IP for callbacks (EPS requires accessible URLs)
      const successUrl = process.env.PAYMENT_SUCCESS_URL || `${frontendBaseUrl}/payment/success`;
      const failUrl = process.env.PAYMENT_FAIL_URL || `${frontendBaseUrl}/payment/failed`;
      const cancelUrl = process.env.PAYMENT_CANCEL_URL || `${frontendBaseUrl}/payment/cancel`;

      // Initialize payment with EPS gateway
      const customerOrderId = this.eps.generateCustomerOrderId();
      
      const paymentInit = await this.eps.initPayment({
        totalAmount: amount,
        transactionId,
        customerOrderId,
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
        // Parse cart data and create product list for EPS
        productList: cartData ? JSON.parse(cartData).items.map((item: any) => ({
          ProductName: item.productName,
          NoOfItem: item.quantity.toString(),
          ProductProfile: 'general',
          ProductCategory: productCategory,
          ProductPrice: item.price.toString(),
        })) : undefined,
      });

      if (!paymentInit.success) {
        // Update payment status to failed
        await this.prisma.coursePayment.update({
          where: { id: payment.id },
          data: { status: CoursePaymentStatus.FAILED },
        });

        throw new BadRequestException(paymentInit.message || 'Failed to initialize payment');
      }

      this.logger.log(`Payment initiated: ${transactionId} for user: ${userId} via EPS`);

      return {
        success: true,
        paymentId: payment.id,
        transactionId,
        gatewayUrl: paymentInit.gatewayUrl,
        amount,
        originalAmount: payment.originalAmount,
        couponDiscountAmount: payment.couponDiscountAmount,
        couponCode: payment.couponCode,
        currency: 'BDT',
        gateway: 'eps',
      };
    } catch (error) {
      this.logger.error(`Error initiating payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  async previewCourseCoupon(
    userId: string | undefined,
    data: { courseId: string; couponCode: string },
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: data.courseId },
      select: { id: true, title: true, ctaText: true, price: true, discountedPrice: true, discountPercentage: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if ((course as any).ctaText === 'COMING_SOON') {
      throw new BadRequestException('Enrollment is not open yet for this course');
    }

    const baseAmount = getCourseFinalPrice(course as any);
    if (baseAmount <= 0) {
      throw new BadRequestException('Coupons can only be used for paid courses');
    }

    let studentId: string | undefined;
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { student: true },
      });
      studentId = user?.student?.id;
    }

    const result = await this.resolveCourseCouponPricing(
      data.courseId,
      baseAmount,
      data.couponCode,
      studentId,
    );

    if (!result.appliedCoupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    return {
      success: true,
      courseId: data.courseId,
      baseAmount,
      finalAmount: result.finalAmount,
      discountAmount: result.discountAmount,
      coupon: {
        id: result.appliedCoupon.id,
        code: result.appliedCoupon.code,
        description: result.appliedCoupon.description,
        discountType: result.appliedCoupon.discountType,
        discountValue: result.appliedCoupon.discountValue,
      },
    };
  }

  private async resolveCourseCouponPricing(
    courseId: string,
    baseAmount: number,
    couponCode?: string,
    studentId?: string,
  ) {
    const normalizedCode = couponCode?.trim().toUpperCase();

    if (!normalizedCode) {
      return {
        finalAmount: baseAmount,
        discountAmount: 0,
        appliedCoupon: null,
      };
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, instructorId: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const candidateCoupons = await this.prisma.courseCoupon.findMany({
      where: {
        code: normalizedCode,
        instructorId: course.instructorId,
        OR: [
          { courseId },
          { applyToAllCourses: true } as any,
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (candidateCoupons.length > 1) {
      this.logger.warn(
        `Multiple coupons found for code ${normalizedCode} and instructor ${course.instructorId}. Using deterministic priority.`
      );
    }

    const exactCourseCoupon = candidateCoupons.find((item) => item.courseId === courseId);
    const allCoursesCoupon = candidateCoupons.find((item) => Boolean((item as any).applyToAllCourses));

    const coupon = exactCourseCoupon ?? allCoursesCoupon ?? null;

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code for this course');
    }

    if (!(coupon as any).applyToAllCourses && coupon.courseId !== courseId) {
      throw new BadRequestException('Invalid coupon code for this course');
    }

    const now = new Date();
    if (!coupon.isActive) {
      throw new BadRequestException('This coupon is inactive');
    }
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BadRequestException('This coupon is not active yet');
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new BadRequestException('This coupon has expired');
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('This coupon has reached its usage limit');
    }

    if (coupon.minOrderAmount > 0 && baseAmount < coupon.minOrderAmount) {
      throw new BadRequestException(`Minimum order amount for this coupon is ${coupon.minOrderAmount} BDT`);
    }

    if (studentId) {
      const studentUsageCount = await this.prisma.courseCouponUsage.count({
        where: {
          couponId: coupon.id,
          studentId,
        },
      });

      if (studentUsageCount >= coupon.perStudentLimit) {
        throw new BadRequestException('You have already reached the usage limit for this coupon');
      }
    }

    let discountAmount =
      coupon.discountType === CourseCouponDiscountType.PERCENTAGE
        ? (baseAmount * coupon.discountValue) / 100
        : coupon.discountValue;

    if (coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }

    discountAmount = Number(Math.min(baseAmount, Math.max(0, discountAmount)).toFixed(2));

    if (discountAmount <= 0) {
      throw new BadRequestException('Coupon does not provide any discount for this order');
    }

    const finalAmount = Number(Math.max(0, baseAmount - discountAmount).toFixed(2));

    if (finalAmount < 1) {
      throw new BadRequestException('This coupon reduces payable amount below the minimum payment amount (1 BDT). Please use a smaller coupon.');
    }

    return {
      finalAmount,
      discountAmount,
      appliedCoupon: coupon,
    };
  }

  /**
   * Verify and validate payment with EPS
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

    // Validate with EPS
    let isValid = false;
    try {
      const validation = await this.eps.validatePayment(transactionId, payment.amount, payment.currency);
      isValid = validation.isValid;

      // Update payment with EPS transaction details
      if (validation.data) {
        await this.prisma.coursePayment.update({
          where: { id: payment.id },
          data: {
            bankTransactionId: validation.epsTransactionId || validation.data.EpsTransactionId,
            cardType: validation.data.TransactionType,
            cardIssuer: validation.data.FinancialEntity,
            ipnData: JSON.stringify(validation.data),
          },
        });
      }
    } catch (error) {
      this.logger.error(`EPS validation error: ${error.message}`);
      isValid = false;
    }

    if (isValid) {
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
    } else {
      // Mark as failed
      await this.prisma.coursePayment.update({
        where: { id: payment.id },
        data: { status: CoursePaymentStatus.FAILED },
      });

      throw new BadRequestException('Payment validation failed');
    }
  }

  /**
   * Handle IPN (Instant Payment Notification)
   * Note: EPS does not use IPN, it uses redirect URLs instead
   * This method is kept for backward compatibility but not actively used
   */
  async handleIPN(ipnData: any) {
    try {
      this.logger.warn('IPN received but EPS uses redirect URLs, not IPN');
      this.logger.log(`IPN Data:`, JSON.stringify(ipnData));
      
      // EPS doesn't use IPN, so just return success
      return { 
        success: true, 
        message: 'IPN not used with EPS gateway' 
      };
    } catch (error) {
      this.logger.error(`Error handling IPN: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Complete payment and create enrollment/order
   * Uses Prisma transaction to ensure data consistency
   */
  async completePayment(paymentId: string) {
    try {
      // Use Prisma transaction to ensure all-or-nothing atomicity
      return await this.prisma.$transaction(async (tx) => {
        // Fetch and lock payment record
        const payment = await tx.coursePayment.findUnique({
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
        const user = await tx.user.findUnique({
          where: { email: payment.customerEmail },
          include: { student: true },
        });

        // Handle course enrollment (requires user account)
        if (payment.courseId) {
          if (!user || !user.student) {
            throw new NotFoundException('Student account required for course enrollment. Please sign up first.');
          }

          if (payment.couponId) {
            const coupon = await tx.courseCoupon.findUnique({
              where: {
                id: payment.couponId,
              },
            });

            if (!coupon) {
              throw new BadRequestException('Applied coupon is no longer valid');
            }

            if (!payment.course?.instructorId || coupon.instructorId !== payment.course.instructorId) {
              throw new BadRequestException('Applied coupon is not valid for this course');
            }

            if (!(coupon as any).applyToAllCourses && coupon.courseId !== payment.courseId) {
              throw new BadRequestException('Applied coupon is not valid for this course');
            }

            const now = new Date();
            if (!coupon.isActive || (coupon.startsAt && coupon.startsAt > now) || (coupon.expiresAt && coupon.expiresAt < now)) {
              throw new BadRequestException('Applied coupon has expired or is inactive');
            }

            if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
              throw new BadRequestException('Applied coupon usage limit has been reached');
            }

            const studentUsageCount = await tx.courseCouponUsage.count({
              where: {
                couponId: coupon.id,
                studentId: user.student.id,
              },
            });

            if (studentUsageCount >= coupon.perStudentLimit) {
              throw new BadRequestException('Coupon usage limit reached for this student');
            }
          }

          // Check for duplicate enrollment (within transaction)
          const existingEnrollment = await tx.enrollment.findFirst({
            where: {
              studentId: user.student.id,
              courseId: payment.courseId,
            },
          });

          if (existingEnrollment) {
            throw new BadRequestException('Already enrolled in this course');
          }

          const enrollment = await tx.enrollment.create({
            data: {
              studentId: user.student.id,
              courseId: payment.courseId,
              paymentId: payment.id,
            },
          });

          // Update course enrolled students count
          await tx.course.update({
            where: { id: payment.courseId },
            data: {
              enrolledStudents: { increment: 1 },
              totalStudents: { increment: 1 },
            },
          });

          // Update student stats
          await tx.student.update({
            where: { id: user.student.id },
            data: {
              enrolledCourses: { increment: 1 },
            },
          });

          // Update instructor stats if instructor exists
          if (payment.course?.instructorId) {
            await tx.instructor.update({
              where: { id: payment.course.instructorId },
              data: {
                totalStudents: { increment: 1 },
              },
            });
          }

          if (payment.couponId && Number(payment.couponDiscountAmount || 0) > 0) {
            await tx.courseCouponUsage.create({
              data: {
                couponId: payment.couponId,
                paymentId: payment.id,
                studentId: user.student.id,
                discountAmount: Number(payment.couponDiscountAmount || 0),
              },
            });

            await tx.courseCoupon.update({
              where: { id: payment.couponId },
              data: {
                usageCount: { increment: 1 },
              },
            });
          }

          this.logger.log(`Enrollment created: ${enrollment.id} for payment: ${paymentId}`);
        }

        // Handle shop order from cart
        if (payment.metadata) {
          const cartData = JSON.parse(payment.metadata);
          
          // Validate stock availability for all items (within transaction)
          for (const item of cartData.items) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
            });

            if (!product) {
              throw new NotFoundException(`Product not found: ${item.productId}`);
            }

            if (product.stockQuantity < item.quantity) {
              throw new BadRequestException(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
            }
          }
          
          // Create order
          const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          const order = await tx.order.create({
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
              transactionId: payment.transactionId,
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

          // Update product stock atomically
          for (const item of cartData.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: { decrement: item.quantity },
              },
            });
          }

          this.logger.log(`Shop order created: ${order.id} from payment: ${paymentId}`);
        }

        // Update payment status to COMPLETED (within transaction)
        await tx.coursePayment.update({
          where: { id: paymentId },
          data: { status: CoursePaymentStatus.COMPLETED },
        });

        this.logger.log(`Payment completed: ${paymentId}`);

        return { success: true, message: 'Payment completed successfully', payment };
      }, {
        maxWait: 5000, // Maximum time to wait for transaction slot (5 seconds)
        timeout: 10000, // Maximum time transaction can run (10 seconds)
      });

      // Send emails AFTER transaction completes successfully (non-blocking)
      // This is done outside transaction to avoid delays and ensure emails don't block payment completion
      this.sendPaymentEmails(paymentId).catch(error => {
        this.logger.error('Error sending payment emails (non-critical):', error);
      });

    } catch (error) {
      this.logger.error(`Error completing payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Send confirmation emails after payment completion (non-blocking)
   * Private method called after transaction commits
   */
  private async sendPaymentEmails(paymentId: string) {
    try {
      const payment = await this.prisma.coursePayment.findUnique({
        where: { id: paymentId },
        include: { 
          course: true, 
          product: true,
          enrollments: {
            include: {
              student: {
                include: { user: true }
              }
            }
          }
        },
      });

      if (!payment) return;

      const user = payment.enrollments[0]?.student?.user;

      // Send enrollment confirmation email for courses
      if (payment.courseId && payment.course && user?.email) {
        // Get instructor name for email
        let instructorName = 'HackToLive Instructor';
        if (payment.course.instructorId) {
          const instructor = await this.prisma.instructor.findUnique({
            where: { id: payment.course.instructorId },
            include: { user: true },
          });
          instructorName = instructor?.user?.name || instructorName;
        }

        this.logger.log(`📧 Sending enrollment confirmation email to ${user.email} for course: ${payment.course.title}`);
        const sent = await this.emailService.sendCourseEnrollmentConfirmation(
          user.email,
          user.name || 'Student',
          payment.course.title,
          payment.course.slug,
          instructorName,
          false, // Paid course
        );
        
        if (sent) {
          this.logger.log(`✅ Enrollment confirmation email sent successfully to ${user.email}`);
        } else {
          this.logger.error(`❌ Failed to send enrollment confirmation email to ${user.email}`);
        }
      }

      // Send order confirmation email for shop orders
      if (payment.metadata && payment.customerEmail) {
        this.logger.log(`📧 Order confirmation email needed for ${payment.customerEmail}`);
        // TODO: Implement order confirmation email
        // await this.emailService.sendOrderConfirmation(...)
      }

      // Send payment receipt email
      if (payment.customerEmail) {
        this.logger.log(`📧 Sending payment receipt to ${payment.customerEmail}`);
        const courseName = payment.course?.title || payment.product?.name || 'Product/Service';
        const sent = await this.emailService.sendPaymentReceipt(
          payment.customerEmail,
          payment.customerName,
          payment.transactionId,
          payment.amount,
          payment.currency,
          courseName,
          payment.paymentMethod || 'EPS',
          payment.cardType || undefined,
          payment.cardIssuer || undefined,
          payment.bankTransactionId || undefined,
        );

        if (sent) {
          this.logger.log(`✅ Payment receipt sent successfully to ${payment.customerEmail}`);
        } else {
          this.logger.error(`❌ Failed to send payment receipt to ${payment.customerEmail}`);
        }
      }
    } catch (error) {
      this.logger.error('Error in sendPaymentEmails:', error);
      // Don't throw - this is non-critical
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
  async getAllPayments(page = 1, limit = 20, status?: CoursePaymentStatus, search?: string) {
    const skip = (page - 1) * limit;

    let where: any = {};

    // Add status filter
    if (status) {
      where.status = status;
    }

    // Add search functionality
    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { transactionId: { contains: searchTerm } },
        { bankTransactionId: { contains: searchTerm } },
        { customerName: { contains: searchTerm } },
        { customerEmail: { contains: searchTerm } },
        { customerPhone: { contains: searchTerm } },
        { course: { title: { contains: searchTerm } } },
        { product: { name: { contains: searchTerm } } },
      ];
    }

    const [payments, total] = await Promise.all([
      this.prisma.coursePayment.findMany({
        where,
        include: {
          course: { 
            select: { 
              id: true, 
              title: true, 
              slug: true,
              price: true,
              instructorId: true,
              instructor: {
                select: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                    }
                  }
                }
              }
            } 
          },
          product: { 
            select: { 
              id: true, 
              name: true, 
              slug: true,
              price: true,
            } 
          },
          enrollments: {
            include: {
              student: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                    }
                  }
                }
              },
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                }
              }
            }
          }
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
