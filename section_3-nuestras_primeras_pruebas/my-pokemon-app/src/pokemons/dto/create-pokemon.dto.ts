import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hp?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Los elementos de array deben ser string
  sprites?: string[];
}
