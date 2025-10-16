import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { getUser } from './get-user.decorator';

// Mock Function
jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn(),
  InternalServerErrorException:
    jest.requireActual('@nestjs/common').InternalServerErrorException,
}));

describe('GetUser Decorator', () => {
  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: { id: '1', name: 'Adriano Ayala' },
      }),
    }),
  } as unknown as ExecutionContext;

  it('should return the user form the request', () => {
    const result = getUser(null, mockExecutionContext);
    // console.log(result);

    expect(result).toEqual({ id: '1', name: 'Adriano Ayala' });
  });

  it('should return the user name form the request', () => {
    const result = getUser('name', mockExecutionContext);

    expect(result).toBe('Adriano Ayala');
  });

  it('should throw an internal server error if user not found', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: null,
        }),
      }),
    } as unknown as ExecutionContext;

    try {
      getUser(null, mockExecutionContext);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('User not found (request)');
    }
  });
});
