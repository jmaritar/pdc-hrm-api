import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';

@Injectable()
export class MunicipalitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const municipalities = await this.prisma.municipality.findMany({
        include: { department: true },
      });

      if (municipalities.length === 0) {
        throw new NotFoundException('No se encontraron municipios');
      }

      return {
        message: 'Lista de municipios obtenida exitosamente',
        data: municipalities,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los municipios');
    }
  }

  async findAllByDepartment(departmentId: string) {
    const department = await this.prisma.department.findUnique({
      where: { id_department: departmentId, is_active: true },
    });

    if (!department) {
      throw new NotFoundException('El departamento especificado no existe');
    }

    try {
      const municipalities = await this.prisma.municipality.findMany({
        where: { department_id: departmentId },
        include: { department: true },
      });

      if (municipalities.length === 0) {
        throw new NotFoundException('No se encontraron municipios');
      }

      return {
        message: 'Lista de municipios obtenida exitosamente',
        data: municipalities,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los municipios');
    }
  }

  async create(data: CreateMunicipalityDto) {
    const existingMunicipality = await this.prisma.municipality.findFirst({
      where: { name: data.name, department_id: data.department_id },
    });

    if (existingMunicipality) {
      throw new ConflictException('El municipio ya está registrado en este departamento.');
    }

    try {
      const municipality = await this.prisma.municipality.create({
        data: {
          name: data.name,
          department_id: data.department_id,
          is_active: data.is_active ?? true,
        },
      });

      return {
        message: 'Municipio creado exitosamente',
        data: municipality,
        statusCode: 201,
      };
    } catch {
      throw new InternalServerErrorException('Error al crear el municipio');
    }
  }

  async update(id: string, data: UpdateMunicipalityDto) {
    await this.findOne(id);

    try {
      const updatedMunicipality = await this.prisma.municipality.update({
        where: { id_municipality: id },
        data,
      });

      return {
        message: 'Municipio actualizado exitosamente',
        data: updatedMunicipality,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar el municipio');
    }
  }

  async deactivate(id: string) {
    const municipality = await this.prisma.municipality.findUnique({
      where: { id_municipality: id },
    });

    if (!municipality) {
      throw new NotFoundException('Municipio no encontrado');
    }

    try {
      await this.prisma.municipality.update({
        where: { id_municipality: id },
        data: { is_active: !municipality.is_active },
      });

      return {
        message: 'Municipio desactivado exitosamente',
        data: null,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al desactivar el municipio');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.municipality.delete({ where: { id_municipality: id } });

      return {
        message: 'Municipio eliminado exitosamente',
        data: null,
      };
    } catch {
      throw new InternalServerErrorException('Error al eliminar el municipio');
    }
  }

  async findOne(id: string) {
    try {
      const municipality = await this.prisma.municipality.findUnique({
        where: { id_municipality: id },
        include: { department: true },
      });

      if (!municipality) {
        throw new NotFoundException('Municipio no encontrado');
      }

      return {
        message: 'Municipio encontrado exitosamente',
        data: municipality,
      };
    } catch {
      throw new InternalServerErrorException('Error al buscar el municipio');
    }
  }
}
