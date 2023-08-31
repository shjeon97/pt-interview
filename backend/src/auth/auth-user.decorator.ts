import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const httpHeader = context.switchToHttp().getRequest()['headers'];
    const user = httpHeader['user'];
    return user;
  },
);
