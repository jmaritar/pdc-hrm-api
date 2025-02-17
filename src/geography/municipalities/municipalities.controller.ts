import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '@/auth/auth.guard';
import { Roles } from '@/auth/roles.decorator';
import { RolesGuard } from '@/auth/roles.guard';

import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { MunicipalitiesService } from './municipalities.service';

@ApiTags('Municipalities')
@ApiBearerAuth()
@Controller('municipalities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MunicipalitiesController {
  constructor(private readonly municipalitiesService: MunicipalitiesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo municipio' })
  create(@Body() createMunicipalityDto: CreateMunicipalityDto) {
    return this.municipalitiesService.create(createMunicipalityDto);
  }

  @Get('all')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de municipios' })
  findAll() {
    return this.municipalitiesService.findAll();
  }

  @Post('find')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener un municipio por ID' })
  findOne(@Body() body: { municipality_id: string }) {
    return this.municipalitiesService.findOne(body.municipality_id);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un municipio' })
  update(@Body() body: { municipality_id: string; data: UpdateMunicipalityDto }) {
    return this.municipalitiesService.update(body.municipality_id, body.data);
  }

  @Post('deactivate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar/Desactivar un municipio' })
  deactivate(@Body() body: { municipality_id: string }) {
    return this.municipalitiesService.deactivate(body.municipality_id);
  }

  @Post('delete')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un municipio' })
  remove(@Body() body: { municipality_id: string }) {
    return this.municipalitiesService.remove(body.municipality_id);
  }
}
