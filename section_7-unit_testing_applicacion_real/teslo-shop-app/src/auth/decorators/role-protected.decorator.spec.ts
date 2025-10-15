import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { META_ROLES, RoleProtected } from './role-protected.decorator';

// Mock Functions
jest.mock('@nestjs/common', () => ({
  // Option #1
  //   SetMetadata: jest.fn().mockImplementation((key, value) => ({
  //     key,
  //     value,
  //   })),
  // Option #2
  SetMetadata: jest.fn(),
}));

describe('RoleProtected Decorator', () => {
  it('should set metadata with the correct roles', () => {
    const roles = [ValidRoles.admin, ValidRoles.user];

    const result = RoleProtected(...roles);

    // Option #1
    // expect(result).toEqual({ key: META_ROLES, value: roles });
    // Option #2
    expect(SetMetadata).toHaveBeenCalled();
    expect(SetMetadata).toHaveBeenCalledWith(META_ROLES, roles);
  });
});
