import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  async (_data, context: ExecutionContext): Promise<User> => {
    const req = await context.switchToHttp().getRequest();
    const user = req.user;
    return user;
  },
);
