import { ValidRoles } from './valid-roles';

describe('Valid roles Enum', () => {
  it('should have correct values', () => {
    expect(ValidRoles.admin).toBe('admin');
    expect(ValidRoles.superUser).toBe('super-user');
    expect(ValidRoles.user).toBe('user');
  });

  it('should contain all expected values', () => {
    const valueToHave = ['admin', 'super-user', 'user'];

    // console.log(Object.values(ValidRoles));

    expect(Object.values(ValidRoles)).toEqual(
      expect.arrayContaining(valueToHave),
    );
  });

  it('should contain all expected keys', () => {
    const keyToHave = ['admin', 'superUser', 'user'];

    // console.log(Object.keys(ValidRoles));

    expect(Object.keys(ValidRoles)).toEqual(expect.arrayContaining(keyToHave));
  });
});
