import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @ApiProperty({
    example: 'mobile',
    enum: ['web', 'mobile'],
    description: 'Plataforma desde donde se inicia sesión',
  })
  @IsString()
  @IsNotEmpty({ message: 'La plataforma es obligatoria' })
  platform: string;
}
