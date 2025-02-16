import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { CompaniesModule } from './companies/companies.module';
import { GeographyModule } from './geography/geography.module';
import { HelloController } from './hello/hello.controller';
import { LogsModule } from './logs/logs.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    CollaboratorsModule,
    CompaniesModule,
    GeographyModule,
    LogsModule,
    PrismaModule,
    AuthModule,
  ], // 🔹 Se asegura que AuthModule está presente
  controllers: [HelloController],
})
export class AppModule {}
