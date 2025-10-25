import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
  IntentoAccesoEntity,
  RolEntity,
  SesionEntity,
  TokenRecuperacionEntity,
  UsuarioEntity,
  UsuarioRolEntity,
  VisitaEntity,
} from '../../infrastructure/database/entities';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbSslEnabled =
      this.configService.get<string>('DB_SSL', 'false') === 'true';
    const caRaw = this.configService.get<string>('MYSQL_CA');
    const caB64 = this.configService.get<string>('MYSQL_CA_B64');
    const ca =
      caRaw ??
      (caB64 ? Buffer.from(caB64, 'base64').toString('utf8') : undefined);

    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [
        UsuarioEntity,
        RolEntity,
        UsuarioRolEntity,
        SesionEntity,
        IntentoAccesoEntity,
        TokenRecuperacionEntity,
        VisitaEntity,
      ],
      // Permitir sincronización controlada en entornos no desarrollo usando DB_SYNC=true
      synchronize:
        this.configService.get<string>('NODE_ENV') === 'development' ||
        this.configService.get<string>('DB_SYNC', 'false') === 'true',
      logging:
        this.configService.get<string>('DB_LOG', 'false') === 'true'
          ? 'all'
          : ['error'],
      timezone: 'Z',
      charset: 'utf8mb4',
      // SSL para proveedores como Aiven/PlanetScale; activar con DB_SSL=true
      // Si hay CA (MYSQL_CA o MYSQL_CA_B64) la usamos con verificación estricta
      // Si no hay CA pero DB_SSL=true, hacemos fallback a no verificar (demo)
      ssl: dbSslEnabled
        ? ca
          ? { ca, rejectUnauthorized: true }
          : { rejectUnauthorized: false }
        : undefined,
      extra: {
        connectionLimit: 10,
      },
    };
  }
}
