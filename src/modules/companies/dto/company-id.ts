import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class CompanyIdDto {
  @ApiProperty({ example: 'uuid-company', description: 'ID de la empresa' })
  @IsUUID()
  company_id: string;
}
