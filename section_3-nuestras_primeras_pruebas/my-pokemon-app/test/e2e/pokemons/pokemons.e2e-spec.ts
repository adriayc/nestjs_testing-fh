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

  it('/pokemons (POST) - with valid body', async () => {
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

  it('/pokemons/:id (GET - should return a Pokémon by ID', async () => {
    const id = 1;

    const response = await request(app.getHttpServer()).get(`/pokemons/${id}`);
    // console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: 'bulbasaur',
      type: 'grass',
      hp: 45,

      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      ],
    });
  });

  it('/pokemons/:id (GET - should return Charmander', async () => {
    const id = 4;

    const response = await request(app.getHttpServer()).get(`/pokemons/${id}`);
    // console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 4,
      name: 'charmander',
      type: 'fire',
      hp: 39,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
      ],
    });
  });

  it('/pokemons/:id (GET - should return Not found', async () => {
    const id = 1_000_000;

    const response = await request(app.getHttpServer()).get(`/pokemons/${id}`);
    // console.log(response.body);

    expect(response.statusCode).toBe(404);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // expect(response.body.error).toBe('Not Found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    // expect(response.body.message).toBe(`Pokemon with id ${id} not found`);
    expect(response.body).toEqual({
      message: `Pokemon with id ${id} not found`,
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('/pokemons/id (PATCH) - should update pokemon', async () => {
    const id = 1;
    const dto = { name: 'bulbasaur update', type: 'grass udpate' };

    const pokemonResponse = await request(app.getHttpServer()).get(
      `/pokemons/${id}`,
    );

    const bulbasaur = pokemonResponse.body as Pokemon;

    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${id}`)
      .send(dto);
    // console.log(response);

    const updatePokemon = response.body as Pokemon;

    expect(response.statusCode).toBe(200);
    // expect(response.body).toEqual({
    //   id: 1,
    //   name: 'bulbasaur update',
    //   type: 'grass',
    //   hp: 45,
    //   sprites: [
    //     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    //     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    //   ],
    // });

    expect(updatePokemon.id).toBe(bulbasaur.id);
    expect(updatePokemon.name).toBe(dto.name);
    expect(updatePokemon.type).toBe(dto.type);
    expect(updatePokemon.hp).toBe(bulbasaur.hp);
    expect(updatePokemon.sprites).toEqual(bulbasaur.sprites);
  });

  it('/pokemons/id (PATCH) - should throw an 404', async () => {
    const id = 1_000_000;

    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${id}`)
      .send({ name: 'bulbasaur update' });
    // console.log(response);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: `Pokemon with id ${id} not found`,
      error: 'Not Found',
      statusCode: 404,
    });
  });
});
