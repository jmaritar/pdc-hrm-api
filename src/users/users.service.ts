import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

      // const user = await this.prisma.user.create({ data });
      await this.prisma.user.create({ data });

      return {
        message: 'Usuario creado exitosamente',
        // data: user,
        statusCode: 201,
      };
    } catch {
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return {
        message: 'Lista de usuarios obtenida exitosamente',
        data: users,
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener los usuarios');
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

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);

    try {
      if (data.password) {
        data.password = bcrypt.hashSync(data.password, 10);
      }

      const updatedUser = await this.prisma.user.update({ where: { id_user: id }, data });

      return {
        message: 'Usuario actualizado exitosamente',
        data: updatedUser,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: string) {
    await this.findOne(id); // 🔹 Verifica si el usuario existe antes de eliminar

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
}
