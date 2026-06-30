import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../auth-user.type';
import { BLOCK_DEMO_USERS_KEY } from '../decorators/block-demo-users.decorator';

@Injectable()
export class DemoUserGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const shouldBlockDemoUsers = this.reflector.getAllAndOverride<boolean>(
      BLOCK_DEMO_USERS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!shouldBlockDemoUsers) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication is required');
    }

    if (user.isDemo) {
      throw new ForbiddenException(
        'Demo users cannot perform critical actions',
      );
    }

    return true;
  }
}
