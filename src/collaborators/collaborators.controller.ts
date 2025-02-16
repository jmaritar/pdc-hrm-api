import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/auth.guard';
import { CollaboratorsService } from './collaborators.service';

@Controller('collaborators')
@UseGuards(JwtAuthGuard)
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Get()
  findAll() {
    return this.collaboratorsService.findAll();
  }
}
