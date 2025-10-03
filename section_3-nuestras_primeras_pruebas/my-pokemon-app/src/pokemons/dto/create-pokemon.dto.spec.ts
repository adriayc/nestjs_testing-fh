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
});
