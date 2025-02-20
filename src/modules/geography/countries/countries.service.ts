import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const countries = await this.prisma.country.findMany({
        include: {
          _count: {
            select: { departments: true },
          },
        },
      });

      if (countries.length === 0) {
        throw new NotFoundException('No se encontraron países');
      }

      // Formatear los datos para incluir count_departments
      const formattedCountries = countries.map(country => ({
        ...country,
        count_departments: country._count.departments,
      }));

      return {
        message: 'Lista de países obtenida exitosamente',
        data: formattedCountries,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los países');
    }
  }

  async create(data: CreateCountryDto) {
    const existingCountry = await this.prisma.country.findFirst({
      where: { name: data.name },
    });

    if (existingCountry) {
      throw new ConflictException('El país ya está registrado');
    }

    try {
      const country = await this.prisma.country.create({
        data: {
          name: data.name,
          code: data.code,
          is_active: data.is_active ?? true,
        },
      });

      return {
        message: 'País creado exitosamente',
        data: country,
        statusCode: 201,
      };
    } catch {
      throw new InternalServerErrorException('Error al crear el país');
    }
  }

  async update(id: string, data: UpdateCountryDto) {
    await this.findOne(id);

    try {
      const updatedCountry = await this.prisma.country.update({
        where: { id_country: id },
        data,
      });

      return {
        message: 'País actualizado exitosamente',
        data: updatedCountry,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar el país');
    }
  }

  async deactivate(id: string) {
    const country = await this.prisma.country.findUnique({
      where: { id_country: id },
    });

    if (!country) {
      throw new NotFoundException('País no encontrado');
    }

    try {
      await this.prisma.country.update({
        where: { id_country: id },
        data: { is_active: !country.is_active },
      });

      return {
        message: 'País desactivado exitosamente',
        data: null,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al desactivar el país');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.country.delete({ where: { id_country: id } });

      return {
        message: 'País eliminado exitosamente',
        data: null,
      };
    } catch {
      throw new InternalServerErrorException('Error al eliminar el país');
    }
  }

  async findOne(id: string) {
    try {
      const country = await this.prisma.country.findUnique({
        where: { id_country: id },
      });

      if (!country) {
        throw new NotFoundException('País no encontrado');
      }

      return {
        message: 'País encontrado exitosamente',
        data: country,
      };
    } catch {
      throw new InternalServerErrorException('Error al buscar el país');
    }
  }
}
