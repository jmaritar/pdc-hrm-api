import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCollaboratorDto {
  @ApiProperty({ example: 'uuid-collaborator', description: 'ID del colaborador', required: false })
  @IsUUID()
  @IsOptional()
  id_collaborator?: string;

  @ApiProperty({ example: 'John Doe', description: 'Nombre del colaborador' })
  @IsString()
  name: string;

  @ApiProperty({ example: 30, description: 'Edad del colaborador' })
  @IsNumber()
  age: number;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Correo electrónico',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+123456789', description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Street, City', description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 5000, description: 'Salario', required: false })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Fecha de inicio',
    required: false,
  })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiProperty({
    example: '2024-12-31T00:00:00.000Z',
    description: 'Fecha de fin',
    required: false,
  })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiProperty({ example: 'Software Engineer', description: 'Posición', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    example: 'uuid-company',
    description: 'ID de la empresa',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  company_id?: string;
}
