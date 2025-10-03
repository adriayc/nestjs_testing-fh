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
});
