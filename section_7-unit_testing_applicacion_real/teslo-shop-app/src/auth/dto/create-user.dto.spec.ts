import { CreateUserDto } from './create-user.dto';
import { validate } from 'class-validator';

describe('CreateUserDTO', () => {
  it('should have the correct properties', async () => {
    const dto = new CreateUserDto();
    dto.fullName = 'Adriano Ayala';
    dto.email = 'adriano@mail.com';
    dto.password = 'Abc123@';

    const errors = await validate(dto);
    // console.log(errors);

    expect(errors.length).toBe(0);
  });

  it('should throw errors if password is not valid', async () => {
    const dto: CreateUserDto = new CreateUserDto();
    dto.fullName = 'Adriano Ayala';
    dto.email = 'adriano@mail.com';
    dto.password = 'abc123@';

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
