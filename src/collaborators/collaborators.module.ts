import { Module } from '@nestjs/common';

import { LogsModule } from '@/logs/logs.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';

@Module({
  imports: [PrismaModule, LogsModule],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService],
})
export class CollaboratorsModule {}
