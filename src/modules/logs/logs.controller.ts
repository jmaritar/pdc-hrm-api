import { Controller, Get, Param } from '@nestjs/common';

import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  // Obtener todos los logs
  @Get()
  async getAllLogs() {
    return this.logsService.getAllLogs();
  }

  // Obtener logs por usuario
  @Get('user/:user_id')
  async getLogsByUser(@Param('user_id') user_id: string) {
    return this.logsService.getLogsByUser(user_id);
  }

  // Obtener logs por tabla
  @Get('table/:table_name')
  async getLogsByTable(@Param('table_name') table_name: string) {
    return this.logsService.getLogsByTable(table_name);
  }
}
