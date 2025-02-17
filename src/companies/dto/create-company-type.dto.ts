import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class CreateCompanyTypeDto {
  @ApiProperty({ example: 'Tecnología', description: 'Nombre del tipo de empresa' })
  @IsString()
  name: string;
}
