import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CompaniesService, CompanyTypesService } from './companies.service';
import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly companyTypesService: CompanyTypesService
  ) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva empresa' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get('all')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de empresas' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Post('find')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  findOne(@Body() body: { company_id: string }) {
    return this.companiesService.findOne(body.company_id);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar una empresa' })
  update(@Body() body: { company_id: string; data: UpdateCompanyDto }) {
    return this.companiesService.update(body.company_id, body.data);
  }

  @Post('deactivate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar/Desactivar una empresa' })
  deactivate(@Body() body: { company_id: string }) {
    return this.companiesService.deactivate(body.company_id);
  }

  @Post('delete')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una empresa' })
  remove(@Body() body: { company_id: string }) {
    return this.companiesService.remove(body.company_id);
  }
}

@ApiTags('Company Types')
@ApiBearerAuth()
@Controller('company-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyTypesController {
  constructor(private readonly companyTypesService: CompanyTypesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo tipo de empresa' })
  create(@Body() createCompanyTypeDto: CreateCompanyTypeDto) {
    return this.companyTypesService.create(createCompanyTypeDto);
  }

  @Get('all')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de tipos de empresa' })
  findAll() {
    return this.companyTypesService.findAll();
  }

  @Post('find')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener un tipo de empresa por ID' })
  findOne(@Body() body: { company_type_id: string }) {
    return this.companyTypesService.findOne(body.company_type_id);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un tipo de empresa' })
  update(@Body() body: { company_type_id: string; data: UpdateCompanyTypeDto }) {
    return this.companyTypesService.update(body.company_type_id, body.data);
  }

  @Post('delete')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un tipo de empresa' })
  remove(@Body() body: { company_type_id: string }) {
    return this.companyTypesService.remove(body.company_type_id);
  }
}
