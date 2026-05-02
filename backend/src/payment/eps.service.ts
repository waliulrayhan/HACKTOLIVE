import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

export interface EpsConfig {
  merchantId: string;
  storeId: string;
  userName: string;
  password: string;
  hashKey: string;
  isLive: boolean;
}

export interface EpsPaymentInitData {
  totalAmount: number;
  transactionId: string;
  customerOrderId: string;
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
  productList?: Array<{
    productName: string;
    noOfItem: string;
    productProfile: string;
    productCategory: string;
    productPrice: string;
  }>;
}

@Injectable()
export class EpsService {
  private readonly logger = new Logger(EpsService.name);
  private static readonly MAX_RATE_LIMIT_RETRIES = 2;
  private static readonly DEFAULT_RETRY_AFTER_SECONDS = 5;
  private readonly config: EpsConfig;
  private readonly baseUrl: string;
  private authToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private readonly httpService: HttpService) {
    // Load configuration from environment variables
    this.config = {
      merchantId: process.env.EPS_MERCHANT_ID || '',
      storeId: process.env.EPS_STORE_ID || '',
      userName: process.env.EPS_USERNAME || '',
      password: process.env.EPS_PASSWORD || '',
      hashKey: process.env.EPS_HASH_KEY || '',
      isLive: process.env.EPS_IS_LIVE === 'true',
    };

    // Use sandbox or live URL
    this.baseUrl = this.config.isLive
      ? 'https://pgapi.eps.com.bd'
      : 'https://sandboxpgapi.eps.com.bd';

    this.logger.log(`EPS initialized in ${this.config.isLive ? 'LIVE' : 'SANDBOX'} mode`);
  }

  /**
   * Generate HMAC SHA-512 hash for request authentication
   * As per EPS API documentation:
   * Step 1: Encode Hash Key using UTF8
   * Step 2: Create HMACSHA512 using encoded data
   * Step 3: Compute Hash using created hmac and specific parameter
   * Step 4: Return Base64 string of Hash
   */
  private generateHash(data: string): string {
    // Encode hash key as UTF8 (Node.js handles this by default)
    const key = Buffer.from(this.config.hashKey, 'utf8');
    
    // Create HMAC SHA-512 and compute hash
    return crypto
      .createHmac('sha512', key)
      .update(data, 'utf8')
      .digest('base64');
  }

  /**
   * Invalidate cached token (call when authentication fails)
   */
  private invalidateToken(): void {
    this.authToken = null;
    this.tokenExpiry = null;
    this.logger.log('EPS token invalidated');
  }

  /**
   * Get authentication token from EPS
   */
  async getToken(forceRefresh = false, retryCount = 0): Promise<string> {
    try {
      // Check if we have a valid token (unless forcing refresh)
      if (!forceRefresh && this.authToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
        return this.authToken as string;
      }

      this.logger.log('Requesting new EPS authentication token');

      // Generate hash for authentication
      // As per API doc: Hash is created using 'userName' parameter only
      const hash = this.generateHash(this.config.userName);

      const payload = {
        userName: this.config.userName,
        password: this.config.password,
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/v1/Auth/GetToken`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'x-hash': hash,
          },
        })
      );

      if (response.data && response.data.token) {
        this.authToken = response.data.token;
        
        // Set token expiry (usually tokens are valid for 1 hour, but we'll refresh after 50 minutes to be safe)
        this.tokenExpiry = new Date();
        this.tokenExpiry.setMinutes(this.tokenExpiry.getMinutes() + 50);

        this.logger.log('EPS authentication token obtained successfully');
        return response.data.token;
      } else {
        throw new Error('Failed to obtain token from EPS');
      }
    } catch (error) {
      this.invalidateToken();

      if (this.isRateLimitError(error)) {
        const retryAfter = this.getRetryAfterSeconds(error);
        const traceId = error?.response?.data?.traceId;

        if (retryCount < EpsService.MAX_RATE_LIMIT_RETRIES) {
          this.logger.warn(
            `EPS token endpoint rate-limited (429). Retrying in ${retryAfter}s ` +
            `(attempt ${retryCount + 1}/${EpsService.MAX_RATE_LIMIT_RETRIES + 1})` +
            `${traceId ? ` traceId=${traceId}` : ''}`
          );

          await this.waitForRetry(retryAfter);
          return this.getToken(true, retryCount + 1);
        }

        this.logger.error(
          `EPS token endpoint still rate-limited after retries` +
          `${traceId ? ` (traceId=${traceId})` : ''}`
        );
        this.throwRateLimitException(error);
      }

      this.logger.error(`Error getting EPS token: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Check if error is authentication related
   */
  private isAuthError(error: any): boolean {
    const status = error.response?.status;
    // 401 Unauthorized, 403 Forbidden, 404 Not Found (redirect to login)
    return status === 401 || status === 403 || status === 404;
  }

  private isRateLimitError(error: any): boolean {
    return error?.response?.status === 429;
  }

  private getRetryAfterSeconds(error: any): number {
    const retryAfterHeader = error?.response?.headers?.['retry-after'];
    const parsed = Number(retryAfterHeader);
    if (Number.isFinite(parsed) && parsed > 0) {
      return Math.min(parsed, 60);
    }
    return EpsService.DEFAULT_RETRY_AFTER_SECONDS;
  }

  private async waitForRetry(seconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  private throwRateLimitException(error: any): never {
    const retryAfter = this.getRetryAfterSeconds(error);
    const traceId = error?.response?.data?.traceId;
    const suffix = traceId ? ` (traceId: ${traceId})` : '';

    throw new ServiceUnavailableException(
      `Payment gateway is temporarily busy. Please try again in about ${retryAfter} seconds${suffix}.`
    );
  }

  /**
   * Initialize payment with EPS (with automatic token refresh on auth failure)
   */
  async initPayment(data: EpsPaymentInitData, retryCount = 0): Promise<any> {
    try {
      // Get authentication token
      const token = await this.getToken();

      // Prepare payload - using exact field names from API documentation
      const payload = {
        merchantId: this.config.merchantId,
        storeId: this.config.storeId,
        CustomerOrderId: data.customerOrderId,
        merchantTransactionId: data.transactionId,
        transactionTypeId: 1, // 1 = Web, 2 = Android, 3 = IOS
        financialEntityId: 0,
        transitionStatusId: 0,
        totalAmount: data.totalAmount,
        ipAddress: '127.0.0.1',
        version: '1',
        successUrl: data.successUrl,
        failUrl: data.failUrl,
        cancelUrl: data.cancelUrl,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        CustomerAddress: data.customerAddress || 'N/A',
        CustomerAddress2: '',
        CustomerCity: data.customerCity || 'Dhaka',
        CustomerState: '',
        CustomerPostcode: '',
        CustomerCountry: data.customerCountry || 'BD',
        CustomerPhone: data.customerPhone,
        ShipmentName: data.customerName,
        ShipmentAddress: data.customerAddress || 'N/A',
        ShipmentAddress2: '',
        ShipmentCity: data.customerCity || 'Dhaka',
        ShipmentState: '',
        ShipmentPostcode: '',
        ShipmentCountry: data.customerCountry || 'BD',
        ValueA: '',
        ValueB: '',
        ValueC: '',
        ValueD: '',
        ShippingMethod: 'NO',
        NoOfItem: data.productList?.length.toString() || '1',
        ProductName: data.productName,
        ProductProfile: 'general',
        ProductCategory: data.productCategory,
        ProductList: data.productList || [
          {
            ProductName: data.productName,
            NoOfItem: '1',
            ProductProfile: 'general',
            ProductCategory: data.productCategory,
            ProductPrice: data.totalAmount.toString(),
          },
        ],
      };

      // Generate hash for the request
      // As per API doc: Hash is created using 'merchantTransactionId' parameter only
      const hash = this.generateHash(data.transactionId);

      this.logger.log(`Initiating EPS payment for transaction: ${data.transactionId} (attempt ${retryCount + 1})`);

      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/v1/EPSEngine/InitializeEPS`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-hash': hash,
          },
        })
      );

      // Response format from API doc: { TransactionId, RedirectURL, ErrorMessage, ErrorCode }
      if (response.data && response.data.RedirectURL) {
        this.logger.log(`EPS payment session created: ${data.transactionId}`);
        return {
          success: true,
          gatewayUrl: response.data.RedirectURL,
          transactionId: response.data.TransactionId || data.transactionId,
          errorMessage: response.data.ErrorMessage,
          errorCode: response.data.ErrorCode,
        };
      } else {
        this.logger.error(`EPS payment initiation failed: ${response.data?.ErrorMessage || 'Unknown error'}`);
        return {
          success: false,
          message: response.data?.ErrorMessage || 'Payment initialization failed',
          errorCode: response.data?.ErrorCode,
        };
      }
    } catch (error) {
      if (this.isRateLimitError(error)) {
        const retryAfter = this.getRetryAfterSeconds(error);
        const traceId = error?.response?.data?.traceId;

        if (retryCount < EpsService.MAX_RATE_LIMIT_RETRIES) {
          this.logger.warn(
            `EPS InitializeEPS rate-limited (429). Retrying in ${retryAfter}s ` +
            `(attempt ${retryCount + 1}/${EpsService.MAX_RATE_LIMIT_RETRIES + 1})` +
            `${traceId ? ` traceId=${traceId}` : ''}`
          );
          await this.waitForRetry(retryAfter);
          return this.initPayment(data, retryCount + 1);
        }

        this.logger.error(
          `EPS InitializeEPS still rate-limited after retries` +
          `${traceId ? ` (traceId=${traceId})` : ''}`
        );
        this.throwRateLimitException(error);
      }

      // Check if this is an authentication error and we haven't retried yet
      if (this.isAuthError(error) && retryCount === 0) {
        this.logger.warn(`EPS authentication failed (${error.response?.status}), invalidating token and retrying...`);
        this.invalidateToken();
        
        // Retry once with fresh token
        return this.initPayment(data, retryCount + 1);
      }

      this.logger.error(`Error initiating EPS payment: ${error.message}`, error.stack);
      
      // Log response data if available
      if (error.response?.data) {
        this.logger.error(`EPS Error Response: ${JSON.stringify(error.response.data)}`);
      }

      // Log response status for debugging
      if (error.response?.status) {
        this.logger.error(`EPS Response Status: ${error.response.status}`);
      }
      
      throw error;
    }
  }

  /**
   * Check transaction status with EPS (with automatic token refresh on auth failure)
   */
  async checkTransactionStatus(merchantTransactionId: string, retryCount = 0): Promise<any> {
    try {
      // Get authentication token
      const token = await this.getToken();

      // Generate hash for the request
      // As per API doc: Hash is created using 'merchantTransactionId' OR 'EPSTransactionId'
      const hash = this.generateHash(merchantTransactionId);

      this.logger.log(`Checking EPS transaction status: ${merchantTransactionId} (attempt ${retryCount + 1})`);

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/v1/EPSEngine/CheckMerchantTransactionStatus`,
          {
            params: {
              merchantTransactionId,
            },
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-hash': hash,
            },
          }
        )
      );

      // Response format from API doc: { MerchantTransactionId, EpsTransactionId, Status, TotalAmount, ... }
      if (response.data) {
        const status = response.data.Status;
        this.logger.log(`EPS transaction status retrieved: ${merchantTransactionId} - Status: ${status}`);
        
        return {
          success: true,
          status: status,
          data: response.data,
          isValid: status === 'Success',
          merchantTransactionId: response.data.MerchantTransactionId,
          epsTransactionId: response.data.EpsTransactionId,
          totalAmount: response.data.TotalAmount,
          transactionDate: response.data.TransactionDate,
          financialEntity: response.data.FinancialEntity,
        };
      } else {
        return {
          success: false,
          message: 'Failed to retrieve transaction status',
        };
      }
    } catch (error) {
      if (this.isRateLimitError(error)) {
        const retryAfter = this.getRetryAfterSeconds(error);
        const traceId = error?.response?.data?.traceId;

        if (retryCount < EpsService.MAX_RATE_LIMIT_RETRIES) {
          this.logger.warn(
            `EPS transaction status endpoint rate-limited (429). Retrying in ${retryAfter}s ` +
            `(attempt ${retryCount + 1}/${EpsService.MAX_RATE_LIMIT_RETRIES + 1})` +
            `${traceId ? ` traceId=${traceId}` : ''}`
          );
          await this.waitForRetry(retryAfter);
          return this.checkTransactionStatus(merchantTransactionId, retryCount + 1);
        }

        this.logger.error(
          `EPS transaction status endpoint still rate-limited after retries` +
          `${traceId ? ` (traceId=${traceId})` : ''}`
        );
        this.throwRateLimitException(error);
      }

      // Check if this is an authentication error and we haven't retried yet
      if (this.isAuthError(error) && retryCount === 0) {
        this.logger.warn(`EPS authentication failed (${error.response?.status}), invalidating token and retrying...`);
        this.invalidateToken();
        
        // Retry once with fresh token
        return this.checkTransactionStatus(merchantTransactionId, retryCount + 1);
      }

      this.logger.error(`Error checking EPS transaction status: ${error.message}`, error.stack);
      
      // Log response data if available
      if (error.response?.data) {
        this.logger.error(`EPS Error Response: ${JSON.stringify(error.response.data)}`);
      }

      // Log response status for debugging
      if (error.response?.status) {
        this.logger.error(`EPS Response Status: ${error.response.status}`);
      }
      
      throw error;
    }
  }

  /**
   * Validate payment - wrapper around checkTransactionStatus
   */
  async validatePayment(transactionId: string, amount: number, currency: string): Promise<any> {
    try {
      const statusCheck = await this.checkTransactionStatus(transactionId);
      
      if (!statusCheck.success) {
        return {
          isValid: false,
          status: 'FAILED',
          data: statusCheck,
        };
      }

      // Verify amount matches (TotalAmount from API is a string like "1.00")
      const paidAmount = parseFloat(statusCheck.totalAmount || '0');
      const amountMatches = Math.abs(paidAmount - amount) < 0.01; // Allow small floating point difference

      if (!amountMatches) {
        this.logger.warn(
          `Amount mismatch for transaction ${transactionId}: Expected ${amount}, Got ${paidAmount}`
        );
        return {
          isValid: false,
          status: 'AMOUNT_MISMATCH',
          data: statusCheck.data,
        };
      }

      return {
        isValid: statusCheck.isValid,
        status: statusCheck.status,
        data: statusCheck.data,
        epsTransactionId: statusCheck.epsTransactionId,
        merchantTransactionId: statusCheck.merchantTransactionId,
      };
    } catch (error) {
      this.logger.error(`Error validating EPS payment: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate unique transaction ID
   */
  generateTransactionId(prefix = 'EPS'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Generate unique customer order ID
   */
  generateCustomerOrderId(prefix = 'ORD'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
