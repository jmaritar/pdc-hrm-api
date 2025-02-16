import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

import { Request } from 'express';

interface JwtPayload {
  userId: string;
  role: UserRole;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: UserRole[] = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('No tienes permiso para acceder a esta ruta');
    }

    return true;
  }
}
