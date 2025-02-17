import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo usuario (Solo SUPER_ADMIN)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('all')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post('deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Desactivar un usuario (soft delete)' })
  deactivate(@Body() body: { user_id: string }) {
    return this.usersService.deactivate(body.user_id);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario (Solo SUPER_ADMIN)' })
  update(@Body() body: { user_id: string; data: CreateUserDto }) {
    return this.usersService.update(body.user_id, body.data);
  }
}
