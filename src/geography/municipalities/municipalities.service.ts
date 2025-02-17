import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateMunicipalityDto } from './dto/create-municipality.dto';

@Injectable()
export class MunicipalitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMunicipalityDto) {
    const existingMunicipality = await this.prisma.municipality.findFirst({
      where: { name: data.name, department_id: data.department_id },
    });

    if (existingMunicipality) {
      throw new BadRequestException('El municipio ya está registrado en este departamento.');
    }

    const municipality = await this.prisma.municipality.create({
      data: {
        name: data.name,
        department_id: data.department_id,
        is_active: data.is_active ?? true,
      },
    });

    return { message: 'Municipio creado exitosamente', municipality };
  }

  async findAll() {
    return this.prisma.municipality.findMany({
      include: { department: true },
    });
  }
}
