import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const companies = await this.prisma.company.findMany({
        include: {
          company_type: true,
          country: true,
          department: true,
          municipality: true,
        },
      });

      // Retorna un array vacío si no hay compañías
      return {
        message: 'Lista de empresas obtenida exitosamente',
        data: companies.length > 0 ? companies : [],
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener las empresas');
    }
  }

  async create(data: CreateCompanyDto) {
    const existingCompany = await this.prisma.company.findFirst({
      where: { nit: data.nit },
    });

    if (existingCompany) {
      throw new ConflictException('La empresa ya está registrada');
    }

    try {
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

      return {
        message: 'Empresa creada exitosamente',
        data: company,
        statusCode: 201,
      };
    } catch {
      throw new InternalServerErrorException('Error al crear la empresa');
    }
  }

  async update(id: string, data: UpdateCompanyDto) {
    await this.findOne(id);

    try {
      const updatedCompany = await this.prisma.company.update({
        where: { id_company: id },
        data,
      });

      return {
        message: 'Empresa actualizada exitosamente',
        data: updatedCompany,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar la empresa');
    }
  }

  async deactivate(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id_company: id },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    try {
      await this.prisma.company.update({
        where: { id_company: id },
        data: { is_active: !company.is_active },
      });

      return {
        message: 'Empresa desactivada exitosamente',
        data: null,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al desactivar la empresa');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.company.delete({ where: { id_company: id } });

      return {
        message: 'Empresa eliminada exitosamente',
        data: null,
      };
    } catch {
      throw new InternalServerErrorException('Error al eliminar la empresa');
    }
  }

  async findOne(id: string) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id_company: id },
      });

      if (!company) {
        throw new NotFoundException('Empresa no encontrada');
      }

      return {
        message: 'Empresa encontrada exitosamente',
        data: company,
      };
    } catch {
      throw new InternalServerErrorException('Error al buscar la empresa');
    }
  }
}

@Injectable()
export class CompanyTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const companyTypes = await this.prisma.companyType.findMany();

      const formattedCompanyTypes = companyTypes.length > 0 ? companyTypes : [];

      return {
        message: 'Lista de tipos de empresa obtenida exitosamente',
        data: formattedCompanyTypes,
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener los tipos de empresa');
    }
  }

  async create(data: CreateCompanyTypeDto) {
    const existingType = await this.prisma.companyType.findFirst({
      where: { name: data.name },
    });

    if (existingType) {
      throw new ConflictException('El tipo de empresa ya existe');
    }

    try {
      const companyType = await this.prisma.companyType.create({
        data: { name: data.name },
      });

      return {
        message: 'Tipo de empresa creado exitosamente',
        data: companyType,
        statusCode: 201,
      };
    } catch {
      throw new InternalServerErrorException('Error al crear el tipo de empresa');
    }
  }

  async update(id: string, data: UpdateCompanyTypeDto) {
    const existingType = await this.prisma.companyType.findUnique({
      where: { id_company_type: id },
    });

    if (!existingType) {
      throw new NotFoundException('Tipo de empresa no encontrado');
    }

    try {
      const updatedCompanyType = await this.prisma.companyType.update({
        where: { id_company_type: id },
        data,
      });

      return {
        message: 'Tipo de empresa actualizado exitosamente',
        data: updatedCompanyType,
        statusCode: 200,
      };
    } catch {
      throw new InternalServerErrorException('Error al actualizar el tipo de empresa');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.companyType.delete({ where: { id_company_type: id } });

      return {
        message: 'Tipo de empresa eliminado exitosamente',
        data: null,
      };
    } catch {
      throw new InternalServerErrorException('Error al eliminar el tipo de empresa');
    }
  }

  async findOne(id: string) {
    try {
      const companyType = await this.prisma.companyType.findUnique({
        where: { id_company_type: id },
      });

      if (!companyType) {
        throw new NotFoundException('Tipo de empresa no encontrado');
      }

      return {
        message: 'Tipo de empresa encontrado exitosamente',
        data: companyType,
      };
    } catch {
      throw new InternalServerErrorException('Error al buscar el tipo de empresa');
    }
  }
}
