import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRawHeaders } from './raw-headers.decorator';

// Mock Function
jest.mock('@nestjs/common', () => ({
  // createParamDecorator: jest.fn().mockImplementation(() => jest.fn()),
  createParamDecorator: jest.fn(),
}));

describe('RawHeaders Decorator', () => {
  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        rawHeaders: ['Authorization', 'Bearer Token', 'User-Agent', 'NestJS'],
      }),
    }),
  } as unknown as ExecutionContext; // Para hacerlo crear a TS es de ese tipo

  it('should return the raw headers from the request', () => {
    const result = getRawHeaders('', mockExecutionContext);
    // console.log(result);

    expect(result).toEqual([
      'Authorization',
      'Bearer Token',
      'User-Agent',
      'NestJS',
    ]);
  });

  it('should call createParamDecorator with getRawHeader', () => {
    expect(createParamDecorator).toHaveBeenLastCalledWith(getRawHeaders);
  });
});
