import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, AuthUser } from '../auth-user.type';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return data ? user[data] : user;
  },
);
