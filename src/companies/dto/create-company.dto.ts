import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Solutions S.A.', description: 'Razón social de la empresa' })
  @IsString()
  legal_name: string;

  @ApiProperty({ example: 'Tech Solutions', description: 'Nombre comercial de la empresa' })
  @IsString()
  trade_name: string;

  @ApiProperty({ example: '123456789', description: 'Número de identificación tributaria' })
  @IsString()
  nit: string;

  @ApiProperty({ example: '+123456789', description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'info@techsolutions.com',
    description: 'Correo electrónico',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123 Street, City', description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'company-type-id',
    description: 'ID del tipo de empresa',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_type_id?: string;

  @ApiProperty({ example: 'country-id', description: 'ID del país' })
  @IsString()
  country_id: string;

  @ApiProperty({ example: 'department-id', description: 'ID del departamento' })
  @IsString()
  department_id: string;

  @ApiProperty({ example: 'municipality-id', description: 'ID del municipio' })
  @IsString()
  municipality_id: string;
}
