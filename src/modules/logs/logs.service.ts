import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 📌 Obtener todos los logs de auditoría
   */
  async getAllLogs() {
    try {
      const logs = await this.prisma.log.findMany({
        orderBy: { created_at: 'desc' }, // Ordenar por fecha descendente
      });

      return {
        message: 'Lista de logs obtenida exitosamente',
        data: logs,
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener los logs');
    }
  }

  /**
   * 📌 Obtener logs filtrados por usuario
   * @param user_id ID del usuario
   */
  async getLogsByUser(user_id: string) {
    try {
      const logs = await this.prisma.log.findMany({
        where: { user_id },
        orderBy: { created_at: 'desc' },
      });

      return {
        message: 'Lista de logs del usuario obtenida exitosamente',
        data: logs,
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener los logs del usuario');
    }
  }

  /**
   * 📌 Obtener logs filtrados por tabla
   * @param table_name Nombre de la tabla
   */
  async getLogsByTable(table_name: string) {
    try {
      const logs = await this.prisma.log.findMany({
        where: { table_name },
        orderBy: { created_at: 'desc' },
      });

      return {
        message: `Lista de logs para la tabla ${table_name} obtenida exitosamente`,
        data: logs,
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener los logs de la tabla');
    }
  }
}
