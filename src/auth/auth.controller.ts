import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

// import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión en la aplicación móvil (SUPER_ADMIN, HR)' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('login-admin')
  @ApiOperation({ summary: 'Iniciar sesión en la plataforma web (SUPER_ADMIN, ADMIN)' })
  async loginAdmin(@Body() loginDto: LoginDto) {
    return this.authService.loginAdmin(loginDto);
  }
}
