import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { HelloController } from './hello/hello.controller';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { GeographyModule } from './modules/geography/geography.module';
import { LogsModule } from './modules/logs/logs.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CollaboratorsModule,
    CompaniesModule,
    GeographyModule,
    LogsModule,
    SeedModule,
    PrismaModule,
  ],
  controllers: [HelloController],
})
export class AppModule {}
