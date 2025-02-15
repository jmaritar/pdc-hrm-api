import { Module } from '@nestjs/common';

import { CollaboratorsModule } from './collaborators/collaborators.module';
import { CompaniesModule } from './companies/companies.module';
import { GeographyModule } from './geography/geography.module';
import { HelloController } from './hello/hello.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, CollaboratorsModule, CompaniesModule, GeographyModule],
  controllers: [HelloController],
})
export class AppModule {}
