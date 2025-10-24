import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from './../../../src/app.module';
import { User } from './../../../src/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const testingUser = {
  email: 'test@test.com',
  password: 'Abc123@',
  fullName: 'Test User',
};

const testingAdmin = {
  email: 'admin@test.com',
  password: 'Abc123@',
  fullName: 'Test Admin',
};

describe('Auth - Login (2e2)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Agregar el global pipes
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();

    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    // Eliminar los test users
    userRepository.delete({ email: testingUser.email });
    userRepository.delete({ email: testingAdmin.email });
    // Agregar los test users
    const responseUser = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingUser);
    // console.log(responseUser.status);
    // console.log(responseUser.body);
    const responseAdmin = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingAdmin);
    // console.log(responseAdmin.status);
    await userRepository.update(
      { email: testingAdmin.email },
      { roles: ['admin'] },
    );

    // console.log({
    //   testingUser: responseUser.status,
    //   testingAdmin: responseAdmin.status,
    // });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - should throw 400 if no body', async () => {
    // return request(app.getHttpServer()).get('/').expect(404);

    const response = await request(app.getHttpServer()).post('/auth/login');
    // console.log(response);
    // console.log(response.body);

    const errorMessages = [
      'email must be an email',
      'email must be a string',
      'The password must have a Uppercase, lowercase letter and a number',
      'password must be shorter than or equal to 50 characters',
      'password must be longer than or equal to 6 characters',
      'password must be a string',
    ];

    expect(response.status).toBe(400);

    errorMessages.forEach((message) => {
      expect(response.body.message).toContain(message);
    });
  });

  it('/auth/login (POST) - wrong credential - email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@main.comxx', password: testingUser.password });
    // console.log(response.body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Credentials are not valid (email)',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('/auth/login (POST) - wrong credential - password', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testingUser.email, password: 'Abc123xx' });
    // console.log(response.body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Credentials are not valid (password)',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('/auth/login (POST) - valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testingAdmin.email, password: testingAdmin.password });
    // console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: {
        id: expect.any(String),
        email: 'admin@test.com',
        fullName: 'Test Admin',
        isActive: true,
        roles: ['admin'],
      },
      token: expect.any(String),
    });
  });
});
