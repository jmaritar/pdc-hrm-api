import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '@/auth/auth.guard';
import { Roles } from '@/auth/roles.decorator';
import { RolesGuard } from '@/auth/roles.guard';

import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@ApiTags('Countries')
@ApiBearerAuth()
@Controller('countries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo país' })
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get('all')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de países' })
  findAll() {
    return this.countriesService.findAll();
  }

  @Post('find')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener un país por ID' })
  findOne(@Body() body: { country_id: string }) {
    return this.countriesService.findOne(body.country_id);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un país' })
  update(@Body() body: { country_id: string; data: UpdateCountryDto }) {
    return this.countriesService.update(body.country_id, body.data);
  }

  @Post('deactivate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar/Desactivar un país' })
  deactivate(@Body() body: { country_id: string }) {
    return this.countriesService.deactivate(body.country_id);
  }

  @Post('delete')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un país' })
  remove(@Body() body: { country_id: string }) {
    return this.countriesService.remove(body.country_id);
  }
}
