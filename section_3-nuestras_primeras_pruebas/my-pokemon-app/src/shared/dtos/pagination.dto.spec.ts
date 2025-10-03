import 'reflect-metadata'; // Debe ir antes de las importaciones

import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';

// describe('Pagination.dto.ts', () => {});
describe('PaginationDto', () => {
  it('should validate with default values', async () => {
    const dto = new PaginationDto();
    // dto.page = -1;
    // dto.limit = -10;

    const errors = await validate(dto);
    // console.log(errors);

    expect(errors.length).toBe(0);
  });

  it('should validate with valid data', async () => {
    const dto = new PaginationDto();
    dto.limit = 10;
    dto.page = 2;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should not validate with invalid page', async () => {
    const dto = new PaginationDto();
    dto.page = -1;

    const errors = await validate(dto);
    // console.log(errors);

    // expect(errors.length).toBe(1);
    // expect(errors.length).toBeGreaterThanOrEqual(1);
    errors.forEach((error) => {
      if (error.property === 'page') {
        expect(error.constraints?.min).toBeDefined();
      } else {
        // throw 'Esto no tuvo que suceder'; // No recomendado
        // expect(true).toBe(false);
        expect(true).toBeFalsy();
      }
    });
  });

  it('should not validate with invalid limit', async () => {
    const dto = new PaginationDto();
    dto.limit = -2;

    const errors = await validate(dto);
    // console.log(errors);

    // expect(error.length).toBe(1);
    errors.forEach((error) => {
      if (error.property === 'limit') {
        expect(error.constraints?.min).toBeDefined();
      } else {
        expect(true).toBeFalsy();
      }
    });
  });
});
