import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { validateOrReject } from 'class-validator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      if (users.length === 0) {
        throw new NotFoundException('No se encontraron usuarios');
      }
      return {
        message: 'Lista de usuarios obtenida exitosamente',
        data: users,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const hash = bcrypt.hashSync(data.password, 10);

    try {
      if (data.password) {
        data.password = hash;
      }

      // await this.prisma.user.create({ data });
      const user = await this.prisma.user.create({ data });

      return {
        message: 'Usuario creado exitosamente',
        data: user,
        statusCode: 201,
      };
    } catch {
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);

    try {
      if (data.password !== null && data.password !== '') {
        await validateOrReject(Object.assign(new UpdateUserDto(), { password: data.password }));
        data.password = bcrypt.hashSync(data.password, 10);
      } else {
        delete data.password;
      }

      const updatedUser = await this.prisma.user.update({ where: { id_user: id }, data });

      return {
        message: 'Usuario actualizado exitosamente',
        data: updatedUser,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async deactivate(user_id: string) {
    const user = await this.prisma.user.findUnique({ where: { id_user: user_id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    try {
      await this.prisma.user.update({
        where: { id_user: user_id },
        data: { is_active: !user.is_active },
      });

      return {
        message: 'Usuario desactivado exitosamente',
        data: null,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al desactivar el usuario');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.user.delete({ where: { id_user: id } });

      return {
        message: 'Usuario eliminado exitosamente',
        data: null,
      };
    } catch {
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id_user: id } });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return {
        message: 'Usuario encontrado exitosamente',
        data: user,
      };
    } catch {
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }
}
