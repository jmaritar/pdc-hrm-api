import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
