import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../../../src/app.module';
import { join } from 'path';
import { fileNamer } from 'src/files/helpers';
import { existsSync, unlinkSync } from 'fs';
import { response } from 'express';

describe('FileModule (E2E)', () => {
  let app: INestApplication;

  // Path de la imagen ('files')
  const testImagePath = join(__dirname, 'test-image.jpg');

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

  it('should throw 400 error if file is not image', async () => {
    const response = await request(app.getHttpServer())
      .post('/files/product')
      .attach('file', Buffer.from('This is a test file'), 'test.txt'); // Subir un archivo

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Make sure that the file is an image',
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('should upload image file successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/files/product')
      .attach('file', testImagePath);
    // console.log(response.status);
    // console.log(response.body);

    const fileName = response.body.fileName;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('secureUrl');
    expect(response.body).toHaveProperty('fileName');
    expect(response.body.secureUrl).toContain('/files/product');

    const filePath = join(__dirname, '../../../static/products', fileName);
    const fileExists = existsSync(filePath);

    expect(fileExists).toBeTruthy();

    unlinkSync(filePath); // Eliminar la imagen
  });

  it('should throw a 400 error if the requested image does not exist', async () => {
    const response = await request(app.getHttpServer()).get(
      '/files/product/no-product-image.jpg',
    );

    // console.log(response.status);
    // console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'No product found with image no-product-image.jpg',
      error: 'Bad Request',
      statusCode: 400,
    });
  });
});
