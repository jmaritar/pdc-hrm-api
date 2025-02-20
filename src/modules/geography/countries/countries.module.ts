import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { LogsModule } from '@/modules/logs/logs.module';
import { PrismaService } from '@/prisma/prisma.service';

import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

@Module({
  imports: [AuthModule, LogsModule],
  controllers: [CountriesController],
  providers: [CountriesService, PrismaService],
})
export class CountriesModule {}
