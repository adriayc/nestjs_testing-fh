import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { authenticate } from 'passport';

describe('Auth Service', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create a user and return user with token', async () => {
    const dto: CreateUserDto = {
      email: 'test@mail.com',
      password: 'Abc123@',
      fullName: 'Test User',
    };

    const user = {
      email: dto.email,
      fullName: dto.fullName,
      id: '1',
      isActive: true,
      roles: ['user'],
    } as User;

    jest.spyOn(userRepository, 'create').mockReturnValue(user);
    jest.spyOn(bcrypt, 'hashSync').mockReturnValue('Absjkdjsd123jkfds');

    const result = await authService.create(dto);
    // console.log(result);

    expect(result).toEqual({
      user: {
        email: 'test@mail.com',
        fullName: 'Test User',
        id: '1',
        isActive: true,
        roles: ['user'],
      },
      token: 'mock-jwt-token',
    });
    expect(bcrypt.hashSync).toHaveBeenCalledWith('Abc123@', 10);
  });

  it('should throw an error if email already exist', async () => {
    const dto: CreateUserDto = {
      email: 'test@mail.com',
      password: 'Abc123@',
      fullName: 'Test User',
    };

    jest
      .spyOn(userRepository, 'save')
      .mockRejectedValue({ code: '23505', detail: 'Email already exists' }); // Retornar un error

    await expect(authService.create(dto)).rejects.toThrow(BadRequestException);
    await expect(authService.create(dto)).rejects.toThrow(
      'Email already exists',
    );
  });

  it('should throw an internal sever error', async () => {
    const dto = {
      email: 'test@mail.com',
    } as CreateUserDto;

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // Funcion espia del console.log y no retorne nada

    jest
      .spyOn(userRepository, 'save')
      .mockRejectedValue({ code: '9999', detail: 'Unhandled error' });

    await expect(authService.create(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(authService.create(dto)).rejects.toThrow(
      'Please check server logs',
    );

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith({
      code: '9999',
      detail: 'Unhandled error',
    });

    logSpy.mockRestore();
  });

  it('should login user and return token', async () => {
    const dto: LoginUserDto = {
      email: 'test@mail.com',
      password: 'Abc123@',
    };

    const user = {
      ...dto,
      fullName: 'Test User',
      password: 'Abc123@',
      isActive: true,
      roles: ['user'],
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

    const result = await authService.login(dto);
    // console.log(result);

    expect(result).toEqual({
      user: {
        email: 'test@mail.com',
        fullName: 'Test User',
        isActive: true,
        roles: ['user'],
      },
      token: 'mock-jwt-token',
    });
    expect(result.user.password).not.toBeDefined();
    expect(result.user.password).toBeUndefined();
  });

  it('should throw an Unauthorized Exception if user does not exist', async () => {
    const dto: LoginUserDto = {
      email: 'test@mail.com',
      password: 'Abc123@',
    };

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    await expect(authService.login(dto)).rejects.toThrow(
      'Credentials are not valid (email)',
    );
  });

  it('should throw an Unauthorize Exception if password does not exist', async () => {
    const dto = {
      email: 'test@mail.com',
      password: 'Abc123@',
    } as LoginUserDto;

    const user = {
      fullName: 'Test User',
      password: 'Abc1234@',
      isActive: true,
      roles: ['user'],
    } as User;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    await expect(authService.login(dto)).rejects.toThrow(
      'Credentials are not valid (password)',
    );
  });

  it('should check auth status and return user with new token', async () => {
    const user = {
      id: '1',
      email: 'test@mail.com',
      fullName: 'Test User',
      isActive: true,
      roles: ['user', 'admin'],
    } as User;

    const result = await authService.checkAuthStatus(user);
    // console.log(result);

    expect(result).toEqual({
      user: {
        id: '1',
        email: 'test@mail.com',
        fullName: 'Test User',
        isActive: true,
        roles: ['user', 'admin'],
      },
      token: 'mock-jwt-token',
    });
  });
});
