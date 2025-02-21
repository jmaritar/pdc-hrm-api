import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { validateOrReject } from 'class-validator';

import { CompanyIdDto } from '../companies/dto/company-id';
import { AssignCompanyDto } from './dto/assign-company.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserIdDto } from './dto/user-id';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los usuarios
  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          companies: true, // Relación con las compañías
        },
      });

      // Agregar el contador de empresas a cada usuario
      const formattedUsers = users.map(user => ({
        ...user,
        count_companies: user.companies.length, // Contador de empresas
      }));

      return {
        message: 'Lista de usuarios obtenida exitosamente',
        data: formattedUsers.length > 0 ? formattedUsers : [],
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  /**
   * 📌 Obtener las empresas a las que un usuario aún NO pertenece y que estén activas.
   * @param data Contiene el `user_id` del usuario.
   */
  async findAvailableCompaniesForUser(data: UserIdDto) {
    try {
      // Obtener IDs de empresas a las que el usuario YA pertenece
      const userCompanies = await this.prisma.userCompany.findMany({
        where: { user_id: data.user_id },
        select: { company_id: true },
      });

      const assignedCompanyIds = userCompanies.map(uc => uc.company_id);

      // Buscar todas las empresas activas que NO estén en la lista de asignadas
      const availableCompanies = await this.prisma.company.findMany({
        where: {
          id_company: { notIn: assignedCompanyIds },
          is_active: true, // Solo empresas activas
        },
      });

      return {
        message: 'Lista de empresas disponibles obtenida exitosamente',
        data: availableCompanies,
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener las empresas disponibles');
    }
  }

  // Crear un usuario, opcionalmente asignarlo a una empresa
  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const hash = bcrypt.hashSync(data.password, 10);

    try {
      data.password = hash;
      const user = await this.prisma.user.create({ data });

      // Si se proporciona company_id, asignar usuario a la empresa
      if (data.company_id) {
        const company = await this.prisma.company.findUnique({
          where: { id_company: data.company_id },
        });

        if (!company) {
          throw new NotFoundException('Empresa no encontrada.');
        }

        await this.prisma.userCompany.create({
          data: {
            user_id: user.id_user,
            company_id: data.company_id,
          },
        });
      }

      return {
        message: 'Usuario creado exitosamente',
        data: user,
        statusCode: 201,
      };
    } catch {
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  // Actualizar usuario
  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);

    try {
      if (data.password) {
        await validateOrReject(Object.assign(new UpdateUserDto(), { password: data.password }));
        data.password = bcrypt.hashSync(data.password, 10);
      } else {
        delete data.password;
      }

      const updatedUser = await this.prisma.user.update({
        where: { id_user: id },
        data,
      });

      return {
        message: 'Usuario actualizado exitosamente',
        data: updatedUser,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  // Desactivar usuario (activar/desactivar)
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
        message: 'Usuario actualizado exitosamente',
        data: null,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  // Eliminar usuario
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

  // Obtener usuario por ID
  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id_user: id },
        include: { companies: true },
      });

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

  // Obtener usuarios de una empresa
  async findCompanyUsers(data: CompanyIdDto) {
    try {
      const users = await this.prisma.userCompany.findMany({
        where: { company_id: data.company_id },
        include: { user: true },
      });

      return {
        message: 'Lista de usuarios obtenida exitosamente',
        data: users.length > 0 ? users : [],
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  // Obtener empresas asignadas a un usuario
  async findUserCompanies(data: UserIdDto) {
    try {
      const companies = await this.prisma.userCompany.findMany({
        where: { user_id: data.user_id },
        include: { company: true }, // Esto trae los datos de la empresa
      });

      return {
        message: 'Lista de empresas obtenida exitosamente',
        data: companies.map(item => item.company), // Extraer solo los objetos "company"
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener las empresas');
    }
  }

  // Asignar un usuario a una empresa
  async assignCompany(data: AssignCompanyDto) {
    const user = await this.prisma.user.findUnique({
      where: { id_user: data.user_id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id_company: data.company_id },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada.');
    }

    const existingRelation = await this.prisma.userCompany.findFirst({
      where: {
        user_id: data.user_id,
        company_id: data.company_id,
      },
    });

    if (existingRelation) {
      throw new BadRequestException('El usuario ya está asignado a esta empresa.');
    }

    await this.prisma.userCompany.create({
      data: {
        user_id: data.user_id,
        company_id: data.company_id,
      },
    });

    return { message: 'Usuario asignado a la empresa exitosamente' };
  }

  /**
   * 📌 Eliminar una empresa asignada a un usuario.
   * @param data Contiene el `user_id` del usuario y `company_id` de la empresa.
   */
  async removeCompanyFromUser(data: AssignCompanyDto) {
    try {
      // Verificar si el usuario está asignado a la empresa
      const existingRelation = await this.prisma.userCompany.findFirst({
        where: {
          user_id: data.user_id,
          company_id: data.company_id,
        },
      });

      if (!existingRelation) {
        throw new NotFoundException('El usuario no está asignado a esta empresa.');
      }

      // Eliminar la relación usuario-empresa
      await this.prisma.userCompany.delete({
        where: {
          id_user_company: existingRelation.id_user_company,
        },
      });

      return { message: 'Empresa eliminada del usuario exitosamente' };
    } catch {
      throw new InternalServerErrorException('Error al eliminar la empresa del usuario');
    }
  }
}
