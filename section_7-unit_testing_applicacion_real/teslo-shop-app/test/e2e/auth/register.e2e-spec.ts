import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppModule } from '../../../src/app.module';
import { User } from '../../../src/auth/entities/user.entity';

const testingUser = {
  email: 'test1@test.com',
  password: 'Abc123@',
  fullName: 'Adriano Ayala',
};

describe('AuthModule Register (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
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

    // Obtener el userRepository del módulo - (getRepositoryToken?)
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    // Eliminar el usuario
    await userRepository.delete({ email: testingUser.email });

    await app.close();
  });

  it('/auth/register (POST) - no body', async () => {
    // Evaluar errores esperados
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({});
    // console.log(response.status);
    // console.log(response.body);

    const errorMessages = [
      'email must be an email',
      'email must be a string',
      'The password must have a Uppercase, lowercase letter and a number',
      'password must be shorter than or equal to 50 characters',
      'password must be longer than or equal to 6 characters',
      'password must be a string',
      'fullName must be longer than or equal to 1 characters',
      'fullName must be a string',
    ];

    expect(response.status).toBe(400);

    errorMessages.forEach((message) => {
      expect(response.body.message).toContain(message);
    });
  });

  it('/auth/register (POST) - same email', async () => {
    // Asegurarse de guardar un usuario con el correo
    await request(app.getHttpServer()).post('/auth/register').send(testingUser); // Registra el user
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingUser);
    // console.log(response.status);
    // console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: `Key (email)=(${testingUser.email}) already exists.`,
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/auth/register (POST) - unsafe password', async () => {
    // Evaluar errores esperados
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...testingUser,
        password: 'abc',
      });
    // console.log(response.status);
    // console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: [
        'The password must have a Uppercase, lowercase letter and a number',
        'password must be longer than or equal to 6 characters',
      ],
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('/auth/register (POST) - valid credentials', async () => {
    // Borrar el usuario antes de crearlo de nuevo
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testingUser);
    // console.log(response.status);
    // console.log(response.body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      user: {
        email: 'test1@test.com',
        fullName: 'Adriano Ayala',
        id: expect.any(String),
        isActive: true,
        roles: ['user'],
      },
      token: expect.any(String),
    });
  });
});
