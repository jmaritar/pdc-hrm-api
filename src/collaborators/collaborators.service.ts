import { BadRequestException, Injectable } from '@nestjs/common';
import { LogAction } from '@prisma/client';

import { LogsService } from '@/logs/logs.service';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';

@Injectable()
export class CollaboratorsService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService
  ) {}

  async findAll() {
    return this.prisma.collaborator.findMany();
  }
  async findOne(id: string) {
    const collaborator = await this.prisma.collaborator.findUnique({
      where: { id_collaborator: id },
    });
    if (!collaborator) throw new BadRequestException('Colaborador no encontrado');
    return collaborator;
  }

  async create(data: CreateCollaboratorDto, userId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id_company: data.company_id },
    });
    if (!company) throw new BadRequestException('Empresa no encontrada');

    const collaborator = await this.prisma.collaborator.create({ data });
    await this.logsService.createLog(
      userId,
      'Collaborator',
      LogAction.CREATE,
      collaborator.id_collaborator,
      null
    );
    return collaborator;
  }

  async update(id: string, data: UpdateCollaboratorDto, userId: string) {
    const before = await this.findOne(id);
    const updated = await this.prisma.collaborator.update({
      where: { id_collaborator: id },
      data,
    });

    await this.logsService.createLog(
      userId,
      'Collaborator',
      LogAction.UPDATE,
      id,
      JSON.stringify(before),
      JSON.stringify(updated)
    );

    return updated;
  }

  async remove(id: string, userId: string) {
    const before = await this.findOne(id);
    const deleted = await this.prisma.collaborator.delete({
      where: { id_collaborator: id },
    });

    await this.logsService.createLog(
      userId,
      'Collaborator',
      LogAction.DELETE,
      id,
      JSON.stringify(before),
      null
    );

    return deleted;
  }
}
