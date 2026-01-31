import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface SslcommerzConfig {
  storeId: string;
  storePassword: string;
  isLive: boolean;
}

export interface PaymentInitData {
  totalAmount: number;
  currency: string;
  transactionId: string;
  productName: string;
  productCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  ipnUrl: string;
}

@Injectable()
export class SslcommerzService {
  private readonly logger = new Logger(SslcommerzService.name);
  private readonly config: SslcommerzConfig;
  private readonly baseUrl: string;

  constructor(private readonly httpService: HttpService) {
    // Sandbox credentials from SSLCommerz
    this.config = {
      storeId: process.env.SSLCOMMERZ_STORE_ID || 'testbox',
      storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || 'qwertyui',
      isLive: process.env.SSLCOMMERZ_IS_LIVE === 'true',
    };

    // Use sandbox URL for testing
    this.baseUrl = this.config.isLive
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';

    this.logger.log(`SSLCommerz initialized in ${this.config.isLive ? 'LIVE' : 'SANDBOX'} mode`);
  }

  /**
   * Initialize payment session with SSLCommerz
   */
  async initPayment(data: PaymentInitData): Promise<any> {
    try {
      const payload = {
        store_id: this.config.storeId,
        store_passwd: this.config.storePassword,
        total_amount: data.totalAmount,
        currency: data.currency,
        tran_id: data.transactionId,
        success_url: data.successUrl,
        fail_url: data.failUrl,
        cancel_url: data.cancelUrl,
        ipn_url: data.ipnUrl,
        
        // Product information
        product_name: data.productName,
        product_category: data.productCategory,
        product_profile: 'general',
        
        // Customer information
        cus_name: data.customerName,
        cus_email: data.customerEmail,
        cus_add1: data.customerAddress || 'N/A',
        cus_city: data.customerCity || 'Dhaka',
        cus_country: data.customerCountry || 'Bangladesh',
        cus_phone: data.customerPhone,
        
        // Shipping information (same as customer for digital products)
        shipping_method: 'NO',
        num_of_item: 1,
        
        // Additional parameters
        value_a: '', // Can be used for custom data
        value_b: '',
        value_c: '',
        value_d: '',
      };

      this.logger.log(`Initiating payment for transaction: ${data.transactionId}`);

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/gwprocess/v4/api.php`, payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      if (response.data.status === 'SUCCESS') {
        this.logger.log(`Payment session created: ${data.transactionId}`);
        return {
          success: true,
          gatewayUrl: response.data.GatewayPageURL,
          sessionKey: response.data.sessionkey,
          transactionId: data.transactionId,
        };
      } else {
        this.logger.error(`Payment initiation failed: ${response.data.failedreason}`);
        return {
          success: false,
          message: response.data.failedreason || 'Payment initialization failed',
        };
      }
    } catch (error) {
      this.logger.error(`Error initiating payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Validate payment using SSLCommerz validation API (simple version)
   */
  async validatePayment(transactionId: string, amount: number, currency: string): Promise<any> {
    try {
      const validationUrl = `${this.baseUrl}/validator/api/validationserverAPI.php`;
      
      const payload = {
        val_id: transactionId,
        store_id: this.config.storeId,
        store_passwd: this.config.storePassword,
        format: 'json',
      };

      const response = await firstValueFrom(
        this.httpService.get(validationUrl, {
          params: payload,
        })
      );

      const validationData = response.data;

      // Check if validation was successful
      const isValid = validationData.status === 'VALID' || validationData.status === 'VALIDATED';

      return {
        isValid,
        status: validationData.status,
        data: validationData,
      };
    } catch (error) {
      this.logger.error(`💥 Error validating payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate unique transaction ID
   */
  generateTransactionId(prefix = 'TXN'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Process refund (Note: This requires additional SSLCommerz merchant setup)
   */
  async refundPayment(
    bankTransactionId: string,
    refundAmount: number,
    refundRemarks: string
  ): Promise<any> {
    try {
      const refundUrl = `${this.baseUrl}/validator/api/merchantTransIDvalidationAPI.php`;
      
      const payload = {
        refund_amount: refundAmount,
        refund_remarks: refundRemarks,
        bank_tran_id: bankTransactionId,
        store_id: this.config.storeId,
        store_passwd: this.config.storePassword,
        format: 'json',
      };

      this.logger.log(`Initiating refund for: ${bankTransactionId}`);

      const response = await firstValueFrom(
        this.httpService.get(refundUrl, {
          params: payload,
        })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error processing refund: ${error.message}`, error.stack);
      throw error;
    }
  }
}
