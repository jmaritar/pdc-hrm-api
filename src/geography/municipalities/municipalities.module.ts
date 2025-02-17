import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { LogsModule } from '@/logs/logs.module';
import { PrismaService } from '@/prisma/prisma.service';

import { MunicipalitiesController } from './municipalities.controller';
import { MunicipalitiesService } from './municipalities.service';

@Module({
  imports: [AuthModule, LogsModule],
  controllers: [MunicipalitiesController],
  providers: [MunicipalitiesService, PrismaService],
})
export class MunicipalitiesModule {}
