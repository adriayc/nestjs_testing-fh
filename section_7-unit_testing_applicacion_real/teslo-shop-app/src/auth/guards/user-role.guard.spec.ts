import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from './user-role.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UserRole Guard', () => {
  let guard: UserRoleGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new UserRoleGuard(reflector);

    mockContext = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    } as unknown as ExecutionContext;
  });

  it('should return true if no roles are present', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should return true if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([]);

    expect(guard.canActivate(mockContext)).toBe(true);
  });
});
