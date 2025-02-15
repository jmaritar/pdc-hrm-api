import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCollaboratorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsInt()
  @Min(18, { message: 'La edad mínima es 18 años' })
  @Max(65, { message: 'La edad máxima es 65 años' })
  age: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe asociarse a una empresa' })
  company_id: string;
}
