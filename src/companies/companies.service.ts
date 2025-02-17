import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyDto) {
    const existingCompany = await this.prisma.company.findFirst({
      where: { nit: data.nit },
    });

    if (existingCompany) {
      throw new BadRequestException('La empresa ya está registrada.');
    }

    const company = await this.prisma.company.create({
      data: {
        legal_name: data.legal_name,
        trade_name: data.trade_name,
        nit: data.nit,
        phone: data.phone,
        email: data.email,
        address: data.address,
        company_type_id: data.company_type_id,
        country_id: data.country_id,
        department_id: data.department_id,
        municipality_id: data.municipality_id,
      },
    });

    return { message: 'Empresa creada exitosamente', company };
  }

  async createType(data: CreateCompanyTypeDto) {
    const existingType = await this.prisma.companyType.findFirst({
      where: { name: data.name },
    });

    if (existingType) {
      throw new BadRequestException('El tipo de empresa ya existe.');
    }

    const companyType = await this.prisma.companyType.create({
      data: { name: data.name },
    });

    return { message: 'Tipo de empresa creado exitosamente', companyType };
  }

  async findAll() {
    return this.prisma.company.findMany({
      where: { is_active: true },
      include: { company_type: true, country: true, department: true, municipality: true },
    });
  }

  async findAllTypes() {
    return this.prisma.companyType.findMany();
  }
}
