import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from '../../../src/app.module';
import { User } from '../../../src/auth/entities/user.entity';

import { validate } from 'uuid';

const testingUser = {
  email: 'test@test.com',
  password: 'Abc12345',
  fullName: 'Testing user',
};

const testingAdmin = {
  email: 'admin@test.com',
  password: 'Abc12345',
  fullName: 'Testing admin',
};

describe('AuthModule Private (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  let token: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.delete({ email: testingUser.email });
    await userRepository.delete({ email: testingAdmin.email });

    const responseUser = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingUser);
    const responseAdmin = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingAdmin);

    // Acatualizacion
    await userRepository.update(
      { email: testingAdmin.email },
      { roles: ['admin', 'super-user'] },
    );

    token = responseUser.body.token;
    adminToken = responseAdmin.body.token;
  });

  afterAll(async () => {
    await userRepository.delete({ email: testingUser.email });
    await userRepository.delete({ email: testingAdmin.email });

    await app.close();
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/private')
      .send();

    expect(response.status).toBe(401);
  });

  it('should return new token and user if token is provided', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    // Validar que el id es un uuid válido
    const response = await request(app.getHttpServer())
      .get('/auth/check-status')
      .set('Authorization', `Bearer ${token}`);
    // console.log(response.status);
    // console.log(response.body);

    const responseToken = response.body.token;

    expect(response.status).toBe(200);
    expect(responseToken).not.toEqual(token);
  });

  it('should return custom object if token is valid', async () => {
    // Validar la respuesta
    const response = await request(app.getHttpServer())
      .get('/auth/private')
      .set('Authorization', `Bearer ${token}`);
    // console.log(response.status);
    // console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      ok: true,
      message: 'Hola Mundo Private',
      user: {
        id: expect.any(String),
        email: 'test@test.com',
        fullName: 'Testing user',
        isActive: true,
        roles: ['user'],
      },
      userEmail: 'test@test.com',
      rawHeaders: expect.any(Array),
      headers: expect.any(Object),
    });
  });

  it('should return 403 if admin token is provided', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/private3')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it('should return user if admin token is provided', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/private3')
      .set('Authorization', `Bearer ${adminToken}`);
    // console.log(response.status);
    // console.log(response.body);

    const userId = response.body.user.id;
    // console.log(userId);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
      user: {
        id: expect.any(String),
        email: 'admin@test.com',
        fullName: 'Testing admin',
        isActive: true,
        roles: ['admin', 'super-user'],
      },
    });

    expect(validate(userId)).toBe(true); // Validar UUID
  });
});
