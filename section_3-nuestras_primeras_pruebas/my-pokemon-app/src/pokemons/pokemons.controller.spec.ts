import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { Pokemon } from './entities/pokemon.entity';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

const mockPokemons: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
  },
  {
    id: 2,
    name: 'ivysaur',
    type: 'grass',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
  },
];

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have called the service with correct parameter', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    // Permite observar el comportamiento de un método de un objeto
    jest.spyOn(service, 'findAll');

    await controller.findAll(dto);
    // console.log(pokemons);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalledWith(dto);
  });

  it('should have called the service and check the result', async () => {
    const dto: PaginationDto = { limit: 10, page: 1 };

    // jest.spyOn() - crea un espía sobre un método existente de un objeto (Esto te permite: ver si fue llamado, cuántas veces fue llamado y con qué argumentos).
    // .mockImplemetation() - permite reemplazar la implemetación original de una función o nétodo espiado por una version falsa o personalizada (mock), que tú defines.
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(mockPokemons));

    const pokemons = await controller.findAll(dto);
    // console.log(pokemons);

    expect(pokemons).toBe(mockPokemons);
    expect(pokemons.length).toBe(mockPokemons.length);
  });

  it('should have called the service with the correct id (findOne)', async () => {
    const id = '1';

    const spy = jest
      .spyOn(service, 'findOne')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));

    const pokemon = await controller.findOne(id);

    expect(spy).toHaveBeenCalledWith(+id);
    expect(pokemon).toEqual(mockPokemons[0]);
  });

  it('should have called the service with the correct id and data (update)', async () => {
    const id = '1';
    const dto: UpdatePokemonDto = {
      name: 'bulbasaur updated',
      type: 'grass updated',
    };

    const spy = jest
      .spyOn(service, 'update')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));

    await controller.update(id, dto);
    // console.log(result);

    expect(spy).toHaveBeenCalledWith(+id, dto);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.update).toHaveBeenCalledWith(+id, dto);
  });

  it('should have called delete with the correct id (delete)', async () => {
    const id = '1';

    jest
      .spyOn(service, 'remove')
      .mockImplementation(() => Promise.resolve('Pokemon deleted'));

    const result = await controller.remove(id);

    expect(result).toBe(`Pokemon deleted`);
  });

  it('should call create service method', async () => {
    const data = { name: 'pikachu', type: 'electric' };

    jest
      .spyOn(service, 'create')
      .mockImplementation(() => Promise.resolve(mockPokemons[0]));

    await controller.create(data);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.create).toHaveBeenLastCalledWith(data);
  });
});
