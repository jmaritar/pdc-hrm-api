import { Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { LogsModule } from '@/logs/logs.module';
import { PrismaService } from '@/prisma/prisma.service';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [AuthModule, LogsModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService],
})
export class CompaniesModule {}
