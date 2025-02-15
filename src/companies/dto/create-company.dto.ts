import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'La razón social es obligatoria' })
  legal_name: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre comercial es obligatorio' })
  trade_name: string;

  @IsString()
  @Length(10, 20, { message: 'El NIT debe tener entre 10 y 20 caracteres' })
  nit: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  country_id: string;

  @IsString()
  department_id: string;

  @IsString()
  municipality_id: string;
}
