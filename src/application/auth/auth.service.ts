import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../../shared/utils/crypto.service';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository.interface';
import { IUsuarioRolRepository } from '../../domain/repositories/usuario-rol.repository.interface';
import { IRolRepository } from '../../domain/repositories/rol.repository.interface';
import { Usuario } from '../../domain/entities/usuario.entity';
import { LoginDto, LoginResponseDto, UsuarioResponseDto } from '../../presentation/dto';
import { JwtPayload } from '../../presentation/guards/jwt.strategy';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    @Inject('IUsuarioRolRepository')
    private readonly usuarioRolRepository: IUsuarioRolRepository,
    @Inject('IRolRepository')
    private readonly rolRepository: IRolRepository,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    // Buscar usuario por username o email
    let usuario = await this.usuarioRepository.findByUsername(username);
    if (!usuario) {
      usuario = await this.usuarioRepository.findByEmail(username);
    }

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Verificar contraseña
    const isPasswordValid = await this.cryptoService.comparePassword(password, usuario.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Obtener roles del usuario
    const userRoles = await this.usuarioRolRepository.findByUserId(usuario.id);
    const roles = await Promise.all(
      userRoles.map(async (ur) => {
        const rol = await this.rolRepository.findById(ur.idRol);
        return rol?.nombre || '';
      })
    );

    // Generar tokens
    const payload: JwtPayload = {
      sub: usuario.id,
      username: usuario.username,
      email: usuario.email,
      roles: roles.filter(role => role !== ''),
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });

    // Convertir usuario a DTO
    const userDto = plainToClass(UsuarioResponseDto, usuario, {
      excludeExtraneousValues: true,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.getTokenExpirationSeconds(),
      user: userDto,
    };
  }

  async validateUser(payload: JwtPayload): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findById(payload.sub);
    
    if (!usuario || !usuario.activo) {
      return null;
    }

    return usuario;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const usuario = await this.usuarioRepository.findById(payload.sub);
      if (!usuario || !usuario.activo) {
        throw new UnauthorizedException('Token inválido');
      }

      // Obtener roles actualizados
      const userRoles = await this.usuarioRolRepository.findByUserId(usuario.id);
      const roles = await Promise.all(
        userRoles.map(async (ur) => {
          const rol = await this.rolRepository.findById(ur.idRol);
          return rol?.nombre || '';
        })
      );

      const newPayload: JwtPayload = {
        sub: usuario.id,
        username: usuario.username,
        email: usuario.email,
        roles: roles.filter(role => role !== ''),
      };

      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      });

      const userDto = plainToClass(UsuarioResponseDto, usuario, {
        excludeExtraneousValues: true,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
        tokenType: 'Bearer',
        expiresIn: this.getTokenExpirationSeconds(),
        user: userDto,
      };
    } catch (error) {
      throw new UnauthorizedException('Token de actualización inválido');
    }
  }

  private getTokenExpirationSeconds(): number {
    const expiration = this.configService.get<string>('JWT_EXPIRATION') || '1h';
    
    if (expiration.endsWith('h')) {
      return parseInt(expiration.replace('h', '')) * 3600;
    } else if (expiration.endsWith('m')) {
      return parseInt(expiration.replace('m', '')) * 60;
    } else if (expiration.endsWith('d')) {
      return parseInt(expiration.replace('d', '')) * 86400;
    }
    
    return 3600; // Default 1 hour
  }
}