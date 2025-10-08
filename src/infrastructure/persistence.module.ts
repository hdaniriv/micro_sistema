import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from '../shared/config/database.config';
import {
  UsuarioEntity,
  RolEntity,
  UsuarioRolEntity,
  SesionEntity,
  IntentoAccesoEntity,
  TokenRecuperacionEntity,
  VisitaEntity,
} from './database/entities';
import {
  UsuarioRepository,
  RolRepository,
  UsuarioRolRepository,
  IntentoAccesoRepository,
  VisitaRepository,
} from './repositories';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
    TypeOrmModule.forFeature([
      UsuarioEntity,
      RolEntity,
      UsuarioRolEntity,
      SesionEntity,
      IntentoAccesoEntity,
      TokenRecuperacionEntity,
      VisitaEntity,
    ]),
  ],
  providers: [
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioRepository,
    },
    {
      provide: 'IRolRepository',
      useClass: RolRepository,
    },
    {
      provide: 'IUsuarioRolRepository',
      useClass: UsuarioRolRepository,
    },
    {
      provide: 'IIntentoAccesoRepository',
      useClass: IntentoAccesoRepository,
    },
    {
      provide: 'IVisitaRepository',
      useClass: VisitaRepository,
    },
  ],
  exports: [
    'IUsuarioRepository',
    'IRolRepository',
    'IUsuarioRolRepository',
    'IIntentoAccesoRepository',
    'IVisitaRepository',
    TypeOrmModule,
  ],
})
export class PersistenceModule {}
