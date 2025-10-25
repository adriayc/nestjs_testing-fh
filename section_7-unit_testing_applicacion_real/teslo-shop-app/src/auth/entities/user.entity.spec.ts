import { User } from './user.entity';

describe('User Entity', () => {
  it('should create and User instance', () => {
    const user = new User();

    expect(user).toBeInstanceOf(User);
  });

  it('should clear email before save', () => {
    const user = new User();
    user.email = ' Test@mail.Com ';
    user.checkFieldsBeforeInsert();

    expect(user.email).toBe('test@mail.com');
  });

  it('should clear email before update', () => {
    const user = new User();
    user.email = ' Test@mail.Com ';
    user.checkFieldsBeforeUpdate();

    expect(user.email).toBe('test@mail.com');
  });
});
