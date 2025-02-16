import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { LogsService } from './logs.service';

@Module({
  imports: [PrismaModule],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
