import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

export const Roles = (...roles: UserRole[]) => {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata('roles', roles, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata('roles', roles, target);
    return target;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check both method-level and class-level @Roles decorators
    // Method-level takes precedence over class-level
    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!roles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    console.log('[RolesGuard] Checking authorization');
    console.log('[RolesGuard] Required roles:', roles);
    console.log('[RolesGuard] User:', JSON.stringify(user, null, 2));
    console.log('[RolesGuard] User role:', user?.role);
    console.log('[RolesGuard] Authorization result:', roles.includes(user?.role));
    
    return roles.includes(user?.role);
  }
}
