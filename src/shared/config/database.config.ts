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
      synchronize: this.configService.get<string>('NODE_ENV') === 'development',
      logging: ['error'],
      timezone: 'Z',
      charset: 'utf8mb4',
      // SSL para proveedores como PlanetScale; activar con DB_SSL=true
      ssl:
        this.configService.get<string>('DB_SSL', 'false') === 'true'
          ? { rejectUnauthorized: true }
          : undefined,
      extra: {
        connectionLimit: 10,
      },
    };
  }
}
