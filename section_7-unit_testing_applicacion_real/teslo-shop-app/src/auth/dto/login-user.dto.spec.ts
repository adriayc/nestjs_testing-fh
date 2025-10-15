import { validate } from 'class-validator';
import { LoginUserDto } from './login-user.dto';
import { plainToClass } from 'class-transformer';
import passport from 'passport';

describe('LoginUserDTO', () => {
  it('should have the correct properties', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'adriano@mail.com',
      password: 'Abc123@',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should throw errors if password is invalid', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'adriano@mail.com',
      password: 'abc123@',
    });

    const errors = await validate(dto);
    // console.log(errors);

    const passwordError = errors.find((error) => error.property === 'password');

    expect(passwordError).toBeDefined();
    expect(passwordError.constraints).toBeDefined();
    expect(passwordError.constraints.matches).toBe(
      'The password must have a Uppercase, lowercase letter and a number',
    );
  });
});
