import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';

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

  async loginAdmin({ email, password, platform }: LoginDto): Promise<{
    statusCode: number;
    message: string;
    user?: Omit<
      User,
      'id_user' | 'password' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'
    >;
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return {
        statusCode: 401,
        message: 'Credenciales incorrectas',
        access_token: '',
        refresh_token: '',
      };
    }

    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN) {
      return {
        statusCode: 403,
        message: 'No tienes permisos para acceder a la plataforma web',
        access_token: '',
        refresh_token: '',
      };
    }

    const tokens = await this.generateTokens(user, platform);

    return {
      statusCode: 200,
      message: 'Inicio de sesión exitoso',
      user: tokens.user,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async logout({ refresh_token }: RefreshTokenDto): Promise<{ message: string }> {
    const session = await this.prisma.session.findUnique({
      where: { refresh_token },
    });

    if (!session) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    await this.prisma.session.update({
      where: { refresh_token },
      data: { is_active: false },
    });

    return { message: 'Logout exitoso' };
  }

  private async generateTokens(
    user: User,
    platform: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    user: Omit<User, 'password' | 'created_at' | 'created_by' | 'updated_at' | 'updated_by'>;
  }> {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, created_at, created_by, updated_at, updated_by, ...sanitizedUser } = user;

    return {
      access_token,
      refresh_token,
      user: sanitizedUser,
    };
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
