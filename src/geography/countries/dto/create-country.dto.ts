import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del país es obligatorio' })
  name: string;

  @IsString()
  @Length(2, 3, { message: 'El código del país debe tener 2 o 3 caracteres' })
  code: string;
}
