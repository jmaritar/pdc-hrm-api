import { Module } from '@nestjs/common';

import { CountriesModule } from './countries/countries.module';
import { DepartmentsModule } from './departments/departments.module';
import { MunicipalitiesModule } from './municipalities/municipalities.module';

@Module({
  imports: [CountriesModule, DepartmentsModule, MunicipalitiesModule],
})
export class GeographyModule {}
