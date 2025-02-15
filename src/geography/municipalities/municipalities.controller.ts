import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { MunicipalitiesService } from './municipalities.service';

@Controller('geography/municipalities')
export class MunicipalitiesController {
  constructor(private readonly municipalitiesService: MunicipalitiesService) {}

  @Post()
  create(@Body() createMunicipalityDto: CreateMunicipalityDto) {
    return this.municipalitiesService.create(createMunicipalityDto);
  }

  @Get()
  findAll() {
    return this.municipalitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.municipalitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMunicipalityDto: UpdateMunicipalityDto) {
    return this.municipalitiesService.update(+id, updateMunicipalityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.municipalitiesService.remove(+id);
  }
}
