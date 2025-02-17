import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateMunicipalityDto {
  @ApiProperty({ example: 'Cobán', description: 'Nombre del municipio' })
  @IsString({ message: 'El nombre del municipio debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El nombre del municipio debe tener entre 2 y 100 caracteres' })
  name: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del departamento al que pertenece el municipio',
  })
  @IsNotEmpty({ message: 'El ID del departamento es obligatorio' })
  @IsString({ message: 'El ID del departamento debe ser una cadena de texto' })
  department_id: string;

  @ApiProperty({ example: true, description: 'Estado activo o inactivo del municipio' })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  @IsOptional()
  is_active?: boolean;
}
