import { Controller, Post, Body, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../../application/auth/auth.service';
import { LoginDto, LoginResponseDto } from '../dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve tokens de acceso',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: any
  ): Promise<LoginResponseDto> {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    return this.authService.login(loginDto, ip, userAgent);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refrescar token',
    description: 'Renueva el token de acceso usando el refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  async refresh(
    @Body('refreshToken') refreshToken: string
  ): Promise<LoginResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }
}
