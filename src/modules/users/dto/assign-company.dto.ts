import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class AssignCompanyDto {
  @ApiProperty({ example: 'uuid-user', description: 'ID del usuario' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'uuid-company', description: 'ID de la empresa' })
  @IsUUID()
  company_id: string;
}
