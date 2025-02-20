import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'super@pcd.com', description: 'Correo electrónico único del usuario' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña segura con al menos un número, una minúscula y una mayúscula',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*\d)/, { message: 'La contraseña debe incluir al menos un número' })
  @Matches(/^(?=.*[a-z])/, { message: 'La contraseña debe incluir al menos una letra minúscula' })
  @Matches(/^(?=.*[A-Z])/, { message: 'La contraseña debe incluir al menos una letra mayúscula' })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'SUPER_ADMIN', enum: UserRole, description: 'Rol del usuario' })
  @IsEnum(UserRole, { message: 'El rol seleccionado no es válido' })
  role: UserRole;
}
