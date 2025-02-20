import { ApiProperty } from '@nestjs/swagger';

import { IsUUID } from 'class-validator';

export class UserIdDto {
  @ApiProperty({ example: 'uuid-user', description: 'ID del usuario' })
  @IsUUID()
  user_id: string;
}
