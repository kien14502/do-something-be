import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
