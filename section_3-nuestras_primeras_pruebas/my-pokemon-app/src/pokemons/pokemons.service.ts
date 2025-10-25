import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { PokeapiResponse } from './interfaces/pokeapi.response';
import { Pokemon } from './entities/pokemon.entity';
import { PokeapiPokemonResponse } from './interfaces/pokeapi-pokemon.response';

@Injectable()
export class PokemonsService {
  paginatedPokemonsCache = new Map<string, Pokemon[]>(); // Definir el cache
  pokemonCache = new Map<number, Pokemon>();

  create(createPokemonDto: CreatePokemonDto) {
    const pokemon: Pokemon = {
      ...createPokemonDto,
      id: new Date().getTime(),
      hp: createPokemonDto.hp ?? 0,
      sprites: createPokemonDto.sprites ?? [],
    };

    this.pokemonCache.forEach((storedPokemon) => {
      if (pokemon.name === storedPokemon.name) {
        throw new BadRequestException(
          `Pokemon with name ${pokemon.name} already exists`,
        );
      }
    });

    this.pokemonCache.set(pokemon.id, pokemon);

    return Promise.resolve(pokemon);
  }

  async findAll(paginationDtO: PaginationDto): Promise<Pokemon[]> {
    const { page = 1, limit = 10 } = paginationDtO;
    const offset = (page - 1) * limit;

    // Verificar si existe en cache
    const cacheKey = `${limit}-${page}`;
    if (this.paginatedPokemonsCache.has(cacheKey)) {
      return this.paginatedPokemonsCache.get(cacheKey)!;
    }

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const response = await fetch(url);
    const data = (await response.json()) as PokeapiResponse;

    const pokemonPromises = data.results.map((result) => {
      const url = result.url;
      const id = url.split('/').at(-2)!;

      return this.getPokemonInformation(+id); // Convertir en number
    });

    const pokemons = await Promise.all(pokemonPromises);

    // Almacenar en cache
    this.paginatedPokemonsCache.set(cacheKey, pokemons);

    return pokemons;
  }

  async findOne(id: number) {
    if (this.pokemonCache.has(id)) {
      return this.pokemonCache.get(id);
    }

    const pokemon = await this.getPokemonInformation(id);

    this.pokemonCache.set(id, pokemon);

    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    const updatePokemon = {
      ...pokemon,
      ...updatePokemonDto,
    } as Pokemon;

    this.pokemonCache.set(id, updatePokemon);

    return Promise.resolve(updatePokemon);
  }

  async remove(id: number) {
    const pokemon = await this.findOne(id);

    this.pokemonCache.delete(id);

    return Promise.resolve(`Pokemon with id ${pokemon?.name} removed`);
  }

  private async getPokemonInformation(id: number): Promise<Pokemon> {
    // console.log('ID:', id);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (response.status === 404) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }

    const data = (await response.json()) as PokeapiPokemonResponse;

    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    };
  }
}
