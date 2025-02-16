import { Injectable } from '@nestjs/common';
import { LogAction } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(
    user_id: string | null,
    table_name: string,
    action: LogAction,
    record_id: string,
    before_data?: any,
    after_data?: any
  ) {
    return this.prisma.log.create({
      data: {
        user_id,
        table_name,
        action,
        record_id,
        before_data: before_data ? JSON.stringify(before_data) : null,
        after_data: after_data ? JSON.stringify(after_data) : null,
        created_at: new Date(),
      },
    });
  }
}
