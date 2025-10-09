import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
// import * as request from 'supertest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../src/app.module';
import { Pokemon } from '../../../src/pokemons/entities/pokemon.entity';

describe('Pokemons (e2e)', () => {
  let app: INestApplication<App>;

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
    // app.setGlobalPrefix('api');

    await app.init();
  });

  it('/pokemons (POST) - with no body', async () => {
    // Forma #1
    // return request(app.getHttpServer())
    //   .post('/pokemons')
    //   .expect(200)
    //   .expect('Hello World!');

    // Forma #2
    const response = await request(app.getHttpServer()).post('/pokemons');
    // console.log(response);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const messageArray = response.body.message ?? [];

    expect(response.statusCode).toBe(400);

    expect(messageArray).toContain('name must be a string');
    expect(messageArray).toContain('name should not be empty');
    expect(messageArray).toContain('type must be a string');
    expect(messageArray).toContain('type should not be empty');
  });

  it('/pokemons (POST) - with no body 2', async () => {
    const mostHaveErrorMessage = [
      'name must be a string',
      'name should not be empty',
      'type must be a string',
      'type should not be empty',
    ];

    const response = await request(app.getHttpServer()).post('/pokemons');
    // console.log(response);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const messageArray: string[] = response.body.message ?? [];

    expect(messageArray.length).toBe(mostHaveErrorMessage.length);
    expect(messageArray).toEqual(expect.arrayContaining(mostHaveErrorMessage));
  });

  it('/pokemons (POST - with valid body', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons').send({
      name: 'pikachu',
      type: 'electric',
    });
    // console.log(response);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      hp: 0,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(Number),
      name: 'pikachu',
      sprites: [],
      type: 'electric',
    });
  });

  it('/pokemons (GET) - should return paginated list of pokemons', async () => {
    const response = await request(app.getHttpServer())
      .get('/pokemons')
      .query({ limit: 5, page: 1 });
    // console.log(response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.length).toBe(5);

    (response.body as Pokemon[]).forEach((pokemon) => {
      expect(pokemon).toHaveProperty('id');
      expect(pokemon).toHaveProperty('name');
      expect(pokemon).toHaveProperty('type');
      expect(pokemon).toHaveProperty('hp');
      expect(pokemon).toHaveProperty('sprites');
    });
  });

  it('/pokemons (GET) - should return 20 pokemons', async () => {
    const response = await request(app.getHttpServer())
      .get('/pokemons')
      .query({ limit: 20, page: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.length).toBe(20);
  });
});
