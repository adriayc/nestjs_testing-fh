import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  // Mocks
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      findOneBy: jest.fn(),
    };

    const mockConfigService = {
      // get: jest.fn(),
      get: jest.fn().mockReturnValue('test-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should valid and return user if user exists and is active', async () => {
    const payload: JwtPayload = { id: '123' };
    const mockUser = { id: '123', isActive: true } as User;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

    const result = await strategy.validate(payload);

    expect(result).toEqual(mockUser);
    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: '123' });
  });

  it('should throw Unauthorized Exception if user does not exists', async () => {
    const payload: JwtPayload = { id: '123' };

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate(payload)).rejects.toThrow('Token not valid');
  });

  it('should throw Unauthorized exception if user is not active', async () => {
    const payload: JwtPayload = { id: '123' };
    const mockUser = { id: '123', isActive: false } as User;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(strategy.validate(payload)).rejects.toThrow(
      'User is inactive, talk with an admin',
    );
  });
});
