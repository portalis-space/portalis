import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuth } from 'modules/auth/interface/auth.interface';

export const GetCurrentUser = createParamDecorator(
  async (data: keyof IAuth | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const authUser = request.user;

    if (!data) {
      return authUser;
    }
    if (data == '_id') {
      return authUser[data].toString();
    }

    return authUser[data];
  },
);
