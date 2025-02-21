import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../../auth/auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
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

  // -------------- EMPRESAS ---------------- //

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva empresa' })
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get('all')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de empresas' })
  getAllCompanies() {
    return this.companiesService.findAll();
  }

  @Post('find')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  getCompanyById(@Body() body: { company_id: string }) {
    return this.companiesService.findOne(body.company_id);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar una empresa' })
  updateCompany(@Body() body: { company_id: string; data: UpdateCompanyDto }) {
    return this.companiesService.update(body.company_id, body.data);
  }

  @Post('deactivate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar/Desactivar una empresa' })
  toggleCompanyStatus(@Body() body: { company_id: string }) {
    return this.companiesService.deactivate(body.company_id);
  }

  @Post('delete')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar una empresa' })
  deleteCompany(@Body() body: { company_id: string }) {
    return this.companiesService.remove(body.company_id);
  }

  // -------------- TIPOS DE EMPRESA ---------------- //

  @Post('type')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo tipo de empresa' })
  createCompanyType(@Body() createCompanyTypeDto: CreateCompanyTypeDto) {
    return this.companyTypesService.create(createCompanyTypeDto);
  }

  @Put('type')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un tipo de empresa' })
  updateCompanyType(@Body() body: { company_type_id: string; data: UpdateCompanyTypeDto }) {
    return this.companyTypesService.update(body.company_type_id, body.data);
  }

  @Get('type/all')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de tipos de empresa' })
  getAllCompanyTypes() {
    return this.companyTypesService.findAll();
  }

  @Post('type/find')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener un tipo de empresa por ID' })
  getCompanyTypeById(@Body() body: { company_type_id: string }) {
    return this.companyTypesService.findOne(body.company_type_id);
  }

  @Post('type/delete')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un tipo de empresa' })
  deleteCompanyType(@Body() body: { company_type_id: string }) {
    return this.companyTypesService.remove(body.company_type_id);
  }
}
