import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class AssignCompanyDto {
  @ApiProperty({ example: 'uuid-collaborator', description: 'ID del colaborador' })
  @IsUUID()
  collaborator_id: string;

  @ApiProperty({ example: 'uuid-company', description: 'ID de la empresa' })
  @IsUUID()
  company_id: string;
}
