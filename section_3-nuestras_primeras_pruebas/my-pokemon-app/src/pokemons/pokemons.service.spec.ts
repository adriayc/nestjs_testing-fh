import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pokemon', async () => {
    const data = { name: 'pikachu', type: 'electric' };

    const result = await service.create(data);
    // console.log(result);

    expect(result).toEqual({
      name: 'pikachu',
      type: 'electric',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: expect.any(Number),
      hp: 0,
      sprites: [],
    });
  });

  it('should throw an error if Pokemon exists', async () => {
    const data = { name: 'pikachu', type: 'electric' };

    await service.create(data);

    try {
      await service.create(data);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(error.message).toBe(
        `Pokemon with name ${data.name} already exists`,
      );
    }

    // await expect(service.create(data)).rejects.toThrow(BadRequestException);
  });

  it('should return pokemon if exists', async () => {
    const id = 4;

    const result = await service.findOne(id);
    // console.log(result);

    expect(result).toEqual({
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

  it("should return 404 error if pokemon doesn't exits", async () => {
    const id = 400_000;

    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(id)).rejects.toThrow(
      `Pokemon with id ${id} not found`,
    );
  });

  it('should check properties of the pokemon', async () => {
    const id = 4;

    const pokemon = await service.findOne(id);
    // console.log(pokemon);

    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');

    expect(pokemon).toEqual(
      expect.objectContaining({
        id: id,
        // hp: 39,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        hp: expect.any(Number), // CTRL + . en any y disabled eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      }),
    );
  });

  it('should find all pokemons and cache them', async () => {
    const pokemons = await service.findAll({ limit: 10, page: 1 });

    expect(pokemons).toBeInstanceOf(Array);
    expect(pokemons.length).toBe(10);

    expect(service.paginatedPokemonsCache.has('10-1')).toBeTruthy();
    // expect(service.paginatedPokemonsCache.get('10-1')).toEqual(pokemons);
    expect(service.paginatedPokemonsCache.get('10-1')).toBe(pokemons); // Funcion por que verifica la posicion en memoria
  });
});
