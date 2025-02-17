import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AssignCompanyDto } from './dto/assign-company.dto';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';

@Injectable()
export class CollaboratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCollaboratorDto) {
    const existingCollaborator = await this.prisma.collaborator.findFirst({
      where: { email: data.email },
    });

    if (existingCollaborator) {
      throw new BadRequestException('El colaborador ya existe.');
    }

    const collaborator = await this.prisma.collaborator.create({
      data: {
        name: data.name,
        age: data.age,
        email: data.email,
        phone: data.phone,
        address: data.address,
        salary: data.salary,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
        position: data.position,
      },
    });

    return { message: 'Colaborador creado exitosamente', collaborator };
  }

  async findAll() {
    return this.prisma.collaborator.findMany({
      include: { companies: { include: { company: true } } },
    });
  }

  async findOne(id: string) {
    const collaborator = await this.prisma.collaborator.findUnique({
      where: { id_collaborator: id },
      include: { companies: { include: { company: true } } },
    });

    if (!collaborator) {
      throw new NotFoundException('Colaborador no encontrado.');
    }

    return collaborator;
  }

  async update(id: string, data: UpdateCollaboratorDto) {
    const collaborator = await this.prisma.collaborator.findUnique({
      where: { id_collaborator: id },
    });

    if (!collaborator) {
      throw new NotFoundException('Colaborador no encontrado.');
    }

    const updatedCollaborator = await this.prisma.collaborator.update({
      where: { id_collaborator: id },
      data: {
        name: data.name,
        age: data.age,
        phone: data.phone,
        address: data.address,
        salary: data.salary,
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
        position: data.position,
      },
    });

    return { message: 'Colaborador actualizado exitosamente', updatedCollaborator };
  }

  async remove(id: string) {
    const collaborator = await this.prisma.collaborator.findUnique({
      where: { id_collaborator: id },
    });

    if (!collaborator) {
      throw new NotFoundException('Colaborador no encontrado.');
    }

    await this.prisma.collaborator.delete({
      where: { id_collaborator: id },
    });

    return { message: 'Colaborador eliminado exitosamente' };
  }

  async assignCompany(data: AssignCompanyDto) {
    const collaborator = await this.prisma.collaborator.findUnique({
      where: { id_collaborator: data.collaborator_id },
    });

    if (!collaborator) {
      throw new NotFoundException('Colaborador no encontrado.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id_company: data.company_id },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada.');
    }

    const existingRelation = await this.prisma.collaboratorCompany.findFirst({
      where: {
        collaborator_id: data.collaborator_id,
        company_id: data.company_id,
      },
    });

    if (existingRelation) {
      throw new BadRequestException('El colaborador ya está asignado a esta empresa.');
    }

    await this.prisma.collaboratorCompany.create({
      data: {
        collaborator_id: data.collaborator_id,
        company_id: data.company_id,
      },
    });

    return { message: 'Colaborador asignado a la empresa exitosamente' };
  }

  async deactivate(collaborator_id: string) {
    const collaborator = await this.prisma.collaborator.findUnique({
      where: { id_collaborator: collaborator_id },
    });

    if (!collaborator) {
      throw new NotFoundException('Colaborador no encontrado.');
    }

    await this.prisma.collaborator.update({
      where: { id_collaborator: collaborator_id },
      data: { is_active: !collaborator.is_active },
    });

    return {
      message: collaborator.is_active
        ? 'Colaborador desactivado exitosamente'
        : 'Colaborador activado exitosamente',
    };
  }
}
