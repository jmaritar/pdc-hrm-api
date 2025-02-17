import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'Guatemala', description: 'Nombre del país' })
  @IsString({ message: 'El nombre del país debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El nombre del país debe tener entre 2 y 100 caracteres' })
  name: string;

  @ApiProperty({ example: 'GT', description: 'Código del país', required: false })
  @IsOptional()
  @IsString({ message: 'El código del país debe ser una cadena de texto' })
  @Length(2, 10, { message: 'El código del país debe tener entre 2 y 10 caracteres' })
  code?: string;

  @ApiProperty({ example: '+502', description: 'Código telefónico del país', required: false })
  @IsOptional()
  @IsString({ message: 'El código telefónico debe ser una cadena de texto' })
  @Matches(/^\+\d{1,5}$/, {
    message: 'El código telefónico debe tener un formato válido, como "+502"',
  })
  phone_code?: string;

  @ApiProperty({ example: 'GTQ', description: 'Código de la moneda', required: false })
  @IsOptional()
  @IsString({ message: 'El código de la moneda debe ser una cadena de texto' })
  @Length(2, 10, { message: 'El código de la moneda debe tener entre 2 y 10 caracteres' })
  currency_code?: string;

  @ApiProperty({ example: 'Quetzal', description: 'Nombre de la moneda', required: false })
  @IsOptional()
  @IsString({ message: 'El nombre de la moneda debe ser una cadena de texto' })
  @Length(2, 50, { message: 'El nombre de la moneda debe tener entre 2 y 50 caracteres' })
  currency_name?: string;

  @ApiProperty({ example: 'Q', description: 'Símbolo de la moneda', required: false })
  @IsOptional()
  @IsString({ message: 'El símbolo de la moneda debe ser una cadena de texto' })
  @Length(1, 10, { message: 'El símbolo de la moneda debe tener entre 1 y 10 caracteres' })
  currency_symbol?: string;

  @ApiProperty({
    example: 'https://example.com/flag.png',
    description: 'URL de la bandera',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La URL de la bandera debe ser una cadena de texto' })
  flag?: string;

  @ApiProperty({ example: 'Español', description: 'Idioma principal del país', required: false })
  @IsOptional()
  @IsString({ message: 'El idioma debe ser una cadena de texto' })
  @Length(2, 50, { message: 'El idioma debe tener entre 2 y 50 caracteres' })
  language?: string;

  @ApiProperty({ example: 'Ciudad de Guatemala', description: 'Capital del país', required: false })
  @IsOptional()
  @IsString({ message: 'La capital debe ser una cadena de texto' })
  @Length(2, 100, { message: 'La capital debe tener entre 2 y 100 caracteres' })
  capital?: string;

  @ApiProperty({ example: true, description: 'Estado activo o inactivo del país' })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  is_active: boolean;
}
