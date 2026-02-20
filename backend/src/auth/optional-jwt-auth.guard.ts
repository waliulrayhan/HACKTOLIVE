import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(OptionalJwtAuthGuard.name);

  // Override canActivate to catch errors and allow request through
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try to authenticate using JWT
      const result = await super.canActivate(context);
      this.logger.log('JWT authentication successful');
      return true;
    } catch (error) {
      // If authentication fails (no token, invalid token, etc.), allow the request anyway
      this.logger.log('JWT authentication failed or no token, continuing without auth');
      return true;
    }
  }

  // Override handleRequest to not throw errors for missing/invalid tokens
  handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.warn(`Auth error: ${err.message}`);
    }
    if (!user) {
      this.logger.log('No user found, continuing with null user');
    } else {
      this.logger.log(`User authenticated: ${user.id}`);
    }
    // Return user if authenticated, null if not (no error thrown)
    return user || null;
  }
}
