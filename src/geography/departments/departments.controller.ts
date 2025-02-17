import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '@/auth/auth.guard';
import { Roles } from '@/auth/roles.decorator';
import { RolesGuard } from '@/auth/roles.guard';

import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo departamento' })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get('all')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de departamentos' })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Post('find')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener un departamento por ID' })
  findOne(@Body() body: { department_id: string }) {
    return this.departmentsService.findOne(body.department_id);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un departamento' })
  update(@Body() body: { department_id: string; data: UpdateDepartmentDto }) {
    return this.departmentsService.update(body.department_id, body.data);
  }

  @Post('deactivate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar/Desactivar un departamento' })
  deactivate(@Body() body: { department_id: string }) {
    return this.departmentsService.deactivate(body.department_id);
  }

  @Post('delete')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un departamento' })
  remove(@Body() body: { department_id: string }) {
    return this.departmentsService.remove(body.department_id);
  }
}
