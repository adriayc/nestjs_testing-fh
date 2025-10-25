import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../../../src/app.module';

describe('FileModule (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    // Configurar global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should throw 400 error if no file selected', async () => {
    const response = await request(app.getHttpServer()).post('/files/product');
    // console.log(response.status);
    // console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Make sure that the file is an image',
      error: 'Bad Request',
      statusCode: 400,
    });
  });
});
