import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tips } from '../../dictionary';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const role = request.session.user?.role;

    if (!roles) {
      return true;
    } else if (!role) {
      throw new BadRequestException(tips.httpExeceptions.needLogin);
    } else if (!roles.includes(role)) {
      throw new ForbiddenException(tips.httpExeceptions.noPermission);
    }

    return true;
  }
}
