import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const role = request.session.user?.role;
    if (!role) {
      throw new HttpException('NotLogin', HttpStatus.BAD_REQUEST);
    }
    if (!role.includes(role)) {
      throw new HttpException('NoPermission', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
