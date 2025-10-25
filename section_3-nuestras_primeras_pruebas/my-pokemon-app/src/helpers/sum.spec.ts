import { sum } from './sum.helper';

describe('sum.helper.ts', () => {
  // test(''); // Opcion comun
  it('should sum two numbers', () => {
    // Arrange
    const num1 = 10;
    const num2 = 20;

    // Act
    const result = sum(num1, num2);

    // Assert
    //   expect(result).toBe(30);
    expect(result).toBe(num1 + num2);
    //   expect(sum(10, 20)).toBe(30);
  });
});
