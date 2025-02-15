import { UserRole } from '@prisma/client';

import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*\d)/, { message: 'Debe incluir al menos un número' })
  @Matches(/^(?=.*[a-z])/, { message: 'Debe incluir al menos una letra minúscula' })
  @Matches(/^(?=.*[A-Z])/, { message: 'Debe incluir al menos una letra mayúscula' })
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole, { message: 'Rol inválido. Debe ser SUPER_ADMIN, ADMIN o HR' })
  role: UserRole;
}
