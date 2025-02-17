import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDepartmentDto) {
    const existingDepartment = await this.prisma.department.findFirst({
      where: { name: data.name, country_id: data.country_id },
    });

    if (existingDepartment) {
      throw new BadRequestException('El departamento ya está registrado en este país.');
    }

    const department = await this.prisma.department.create({
      data: {
        name: data.name,
        country_id: data.country_id,
        is_active: data.is_active ?? true,
      },
    });

    return { message: 'Departamento creado exitosamente', department };
  }

  async findAll() {
    return this.prisma.department.findMany({
      include: { country: true },
    });
  }
}
