import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { LogsModule } from '@/modules/logs/logs.module';
import { PrismaService } from '@/prisma/prisma.service';

import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';

@Module({
  imports: [AuthModule, LogsModule],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService, PrismaService],
})
export class CollaboratorsModule {}
