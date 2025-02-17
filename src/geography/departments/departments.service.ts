import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const departments = await this.prisma.department.findMany({
        include: { country: true },
      });

      if (departments.length === 0) {
        throw new NotFoundException('No se encontraron departamentos');
      }

      return {
        message: 'Lista de departamentos obtenida exitosamente',
        data: departments,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los departamentos');
    }
  }

  async findAllByCountry(countryId: string) {
    const country = await this.prisma.country.findUnique({
      where: { id_country: countryId, is_active: true },
    });

    if (!country) {
      throw new NotFoundException('El país especificado no existe');
    }

    try {
      const departments = await this.prisma.department.findMany({
        where: { country_id: countryId },
        include: { country: true },
      });

      if (departments.length === 0) {
        throw new NotFoundException('No se encontraron departamentos');
      }

      return {
        message: 'Lista de departamentos obtenida exitosamente',
        data: departments,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los departamentos');
    }
  }

  async create(data: CreateDepartmentDto) {
    const country = await this.prisma.country.findUnique({
      where: { id_country: data.country_id },
    });

    if (!country) {
      throw new NotFoundException('El país especificado no existe');
    }

    const existingDepartment = await this.prisma.department.findFirst({
      where: { name: data.name, country_id: data.country_id },
    });

    if (existingDepartment) {
      throw new ConflictException('El departamento ya está registrado en este país');
    }

    try {
      const department = await this.prisma.department.create({
        data: {
          name: data.name,
          country_id: data.country_id,
          is_active: data.is_active ?? true,
        },
      });

      return {
        message: 'Departamento creado exitosamente',
        data: department,
        statusCode: 201,
      };
    } catch {
      throw new InternalServerErrorException('Error al crear el departamento');
    }
  }

  async update(id: string, data: UpdateDepartmentDto) {
    await this.findOne(id);

    try {
      const updatedDepartment = await this.prisma.department.update({
        where: { id_department: id },
        data,
      });

      return {
        message: 'Departamento actualizado exitosamente',
        data: updatedDepartment,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar el departamento');
    }
  }

  async deactivate(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id_department: id },
    });

    if (!department) {
      throw new NotFoundException('Departamento no encontrado');
    }

    try {
      await this.prisma.department.update({
        where: { id_department: id },
        data: { is_active: !department.is_active },
      });

      return {
        message: 'Departamento desactivado exitosamente',
        data: null,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al desactivar el departamento');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.department.delete({ where: { id_department: id } });

      return {
        message: 'Departamento eliminado exitosamente',
        data: null,
      };
    } catch {
      throw new InternalServerErrorException('Error al eliminar el departamento');
    }
  }

  async findOne(id: string) {
    try {
      const department = await this.prisma.department.findUnique({
        where: { id_department: id },
        include: { country: true },
      });

      if (!department) {
        throw new NotFoundException('Departamento no encontrado');
      }

      return {
        message: 'Departamento encontrado exitosamente',
        data: department,
      };
    } catch {
      throw new InternalServerErrorException('Error al buscar el departamento');
    }
  }
}
