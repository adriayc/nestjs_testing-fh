import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

describe('Auth Controller', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      create: jest.fn(),
      login: jest.fn(),
      checkAuthStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should create user with the proper DTO', async () => {
    const dto: CreateUserDto = {
      fullName: 'Adriano Ayala',
      email: 'test@mail.com',
      password: 'Abc123@',
    };

    const result = await authController.createUser(dto);
    // console.log(result);

    expect(authService.create).toHaveBeenCalled();
    expect(authService.create).toHaveBeenCalledWith(dto);
  });

  it('should login user with the proper DTO', async () => {
    const dto: LoginUserDto = {
      email: 'test@mail.com',
      password: 'Aab123@',
    };

    await authController.loginUser(dto);

    expect(authService.login).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('should check auth status with the proper DTO', async () => {
    const dto = {
      fullName: 'Adriano Ayala',
      email: 'test@mail.com',
      password: 'Abc123@',
    } as User;

    await authController.checkAuthStatus(dto);

    expect(authService.checkAuthStatus).toHaveBeenCalled();
    expect(authService.checkAuthStatus).toHaveBeenCalledWith(dto);
  });

  it('should return private route data', () => {
    const user = {
      id: '1',
      email: 'test@mail.com',
      fullName: 'Adriano Ayala',
    } as User;
    const request = {} as Express.Request;
    const rawHeaders = ['header1: value1', 'header2: value2'];
    const headers = { header1: 'value1', header2: 'value2' };

    const result = authController.testingPrivateRoute(
      request,
      user,
      user.email,
      rawHeaders,
      headers,
    );
    // console.log(result);

    expect(result).toEqual({
      ok: true,
      message: 'Hola Mundo Private',
      user: { id: '1', email: 'test@mail.com', fullName: 'Adriano Ayala' },
      userEmail: 'test@mail.com',
      rawHeaders: ['header1: value1', 'header2: value2'],
      headers: { header1: 'value1', header2: 'value2' },
    });
  });
});
