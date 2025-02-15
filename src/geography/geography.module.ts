import { Module } from '@nestjs/common';

// import { RouterModule } from '@nestjs/core';

import { CountriesModule } from './countries/countries.module';
import { DepartmentsModule } from './departments/departments.module';
import { MunicipalitiesModule } from './municipalities/municipalities.module';

@Module({
  imports: [
    CountriesModule,
    DepartmentsModule,
    MunicipalitiesModule,
    // RouterModule.register([
    //   {
    //     path: 'geography',
    //     module: GeographyModule,
    //     children: [
    //       {
    //         path: 'countries',
    //         module: CountriesModule,
    //       },
    //     ],
    //   },
    // ]),
  ],
})
export class GeographyModule {}
