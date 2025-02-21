import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../../auth/auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { CompanyIdDto } from '../companies/dto/company-id';
import { AssignCompanyDto } from './dto/assign-company.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserIdDto } from './dto/user-id';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Crear un usuario (opcionalmente asignarlo a una empresa)
  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo usuario (opcionalmente asignarlo a una empresa)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Obtener todos los usuarios
  @Get('all')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  // Obtener un usuario por ID
  @Post('find-user')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  findOne(@Body() body: UserIdDto) {
    return this.usersService.findOne(body.user_id);
  }

  // Actualizar un usuario
  @Put()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  update(@Body() body: { user_id: string; data: UpdateUserDto }) {
    return this.usersService.update(body.user_id, body.data);
  }

  // Activar/Desactivar usuario
  @Post('toggle-status')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Activar o desactivar un usuario' })
  toggleStatus(@Body() body: { user_id: string }) {
    return this.usersService.deactivate(body.user_id);
  }

  // Eliminar un usuario
  @Delete()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  remove(@Body() body: UserIdDto) {
    return this.usersService.remove(body.user_id);
  }

  // Asignar usuario a una empresa
  @Post('assign-company')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Asignar un usuario a una empresa' })
  assignCompany(@Body() body: AssignCompanyDto) {
    return this.usersService.assignCompany(body);
  }

  // Obtener todas las empresas de un usuario
  @Post('find-user-companies')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener todas las empresas de un usuario' })
  findUserCompanies(@Body() body: UserIdDto) {
    return this.usersService.findUserCompanies(body);
  }

  @Post('find-available-companies')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener todas las empresas disponibles para un usuario' })
  findAvailableCompaniesForUser(@Body() body: UserIdDto) {
    return this.usersService.findAvailableCompaniesForUser(body);
  }

  @Delete('remove-company-from-user')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Eliminar una empresa de un usuario' })
  removeCompanyFromUser(@Body() body: AssignCompanyDto) {
    return this.usersService.removeCompanyFromUser(body);
  }

  // Obtener todos los usuarios de una empresa
  @Post('find-company-users')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios de una empresa' })
  findCompanyUsers(@Body() body: CompanyIdDto) {
    return this.usersService.findCompanyUsers(body);
  }
}
