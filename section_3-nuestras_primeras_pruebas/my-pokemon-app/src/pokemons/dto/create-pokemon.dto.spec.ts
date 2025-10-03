import { validate } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';

describe('CreatePokemonDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'electric';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if name is not present', async () => {
    const dto = new CreatePokemonDto();
    dto.type = 'electric';

    const errors = await validate(dto);
    // console.log(errors);

    // expect(errors.length).toBe(1);
    const errorName = errors.find((error) => error.property === 'name');
    expect(errorName).toBeDefined();
  });

  it('should be invalid if type is not present', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';

    const errors = await validate(dto);
    // console.log(errors);

    const errorType = errors.find((error) => error.property === 'type');
    expect(errorType).toBeDefined();
  });

  it('should hp must be positive number', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'electric';
    dto.hp = -10;

    const errors = await validate(dto);
    // console.log(errors);
    const hpError = errors.find((error) => error.property === 'hp');
    const constraints = hpError?.constraints;

    expect(hpError).toBeDefined();
    // expect(constraints).toBe({ min: 'hp must not be less than 0' }); // Error: Solo para tipos primitivos
    expect(constraints).toEqual({ min: 'hp must not be less than 0' });
  });

  it('should be invalid with non-string sprites', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'electric';
    dto.sprites = [123, 456] as unknown as string[];

    const errors = await validate(dto);
    // console.log(errors);
    const spritesError = errors.find((error) => error.property === 'sprites');

    expect(spritesError).toBeDefined();
  });

  it('should be valid with string sprites', async () => {
    const dto = new CreatePokemonDto();
    dto.name = 'pikachu';
    dto.type = 'electric';
    dto.sprites = ['sprite1.png', 'sprite2.png'];

    const errors = await validate(dto);
    // console.log(errors);
    const spritesError = errors.find((error) => error.property === 'sprites'); // No existe ningun error

    // expect(spritesError).not.toBeDefined();
    expect(spritesError).toBeUndefined();
    expect(spritesError).toBe(undefined);
  });
});
