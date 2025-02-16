import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login({
    email,
    password,
    platform,
  }: LoginDto): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(`Credenciales incorrectas ${user.password}`);
    }

    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.HR) {
      throw new UnauthorizedException('No tienes permisos para acceder a la app móvil');
    }

    return this.generateTokens(user, platform);
  }

  async loginAdmin({
    email,
    password,
    platform,
  }: LoginDto): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('No tienes permisos para acceder a la plataforma web');
    }

    return this.generateTokens(user, platform);
  }

  private async generateTokens(
    user: { id_user: string; role: UserRole },
    platform: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: user.id_user, role: user.role };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
    });

    await this.prisma.session.create({
      data: {
        user_id: user.id_user,
        token: access_token,
        refresh_token,
        expires_at: new Date(Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 1000),
        platform,
      },
    });

    return { access_token, refresh_token };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { refresh_token } = refreshTokenDto;

    const session = await this.prisma.session.findUnique({ where: { refresh_token } });

    if (!session) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    let decoded: { sub: string; role: UserRole };
    try {
      decoded = this.jwtService.verify(refresh_token);
    } catch {
      throw new UnauthorizedException('Refresh token expirado o inválido');
    }

    const user = await this.prisma.user.findUnique({ where: { id_user: decoded.sub } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return this.generateTokens(user, session.platform);
  }
}
