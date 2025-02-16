import { ApiProperty } from '@nestjs/swagger';

import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: 'Token de actualización válido',
  })
  @IsJWT()
  @IsString()
  @IsNotEmpty({ message: 'El refresh_token es obligatorio' })
  refresh_token: string;
}
