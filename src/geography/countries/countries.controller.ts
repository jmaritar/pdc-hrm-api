import { Controller, Get } from '@nestjs/common';

import { CountriesService } from './countries.service';

@Controller('geography/countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }
}
