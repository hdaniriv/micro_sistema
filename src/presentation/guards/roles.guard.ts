import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => {
  const SetMetadata = (metadataKey: string, metadataValue: any) => {
    return (target: any, key?: string | symbol, descriptor?: PropertyDescriptor) => {
      if (descriptor) {
        Reflect.defineMetadata(metadataKey, metadataValue, descriptor.value);
        return descriptor;
      }
      Reflect.defineMetadata(metadataKey, metadataValue, target);
      return target;
    };
  };
  return SetMetadata(ROLES_KEY, roles);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles) {
      return false;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}