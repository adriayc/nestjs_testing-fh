import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getRawHeaders = (data: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.rawHeaders; // [Authorization, bearer token, user-agent]
};

// export const RawHeaders = createParamDecorator(
//   (data: string, ctx: ExecutionContext) => {
//     const req = ctx.switchToHttp().getRequest();
//     return req.rawHeaders; // [Authorization, bearer token, user-agent]
//   },
// );

export const RawHeaders = createParamDecorator(getRawHeaders);
