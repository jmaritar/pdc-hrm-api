import { Body, Controller, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../../auth/auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { CollaboratorsService } from './collaborators.service';
import { AssignCompanyDto } from './dto/assign-company.dto';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { FindAllByCompanyDto } from './dto/find-all-by-company-dto';

@ApiTags('Collaborators')
@ApiBearerAuth()
@Controller('collaborators')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Crear un nuevo colaborador' })
  create(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return this.collaboratorsService.create(createCollaboratorDto);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Actualizar un colaborador' })
  update(@Body() updateCollaboratorDto: CreateCollaboratorDto) {
    return this.collaboratorsService.update(updateCollaboratorDto);
  }

  @Post('/assign-company')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Asignar un colaborador a una empresa' })
  assignCompany(@Body() assignCompanyDto: AssignCompanyDto) {
    return this.collaboratorsService.assignCompany(assignCompanyDto);
  }

  @Patch('/deactivate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Desactivar un colaborador (soft delete)' })
  deactivate(@Body() body: { collaborator_id: string }) {
    return this.collaboratorsService.deactivate(body.collaborator_id);
  }

  @Post('/list')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de colaboradores' })
  findAll() {
    return this.collaboratorsService.findAll();
  }

  @Post('find-all-by-company')
  @Roles(UserRole.SUPER_ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Obtener la lista de colaboradores de una empresa' })
  findAllByCompany(@Body() body: FindAllByCompanyDto) {
    return this.collaboratorsService.findAllByCompany(body);
  }
}
