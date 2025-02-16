import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del departamento es obligatorio' })
  name: string;

  @IsString()
  country_id: string;
}
