import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './application/auth/auth.service';
import { MicroservicesModule } from './application/microservices.module';
import { RolService } from './application/roles/rol.service';
import { SecurityModule } from './application/security.module';
import { SeedService } from './application/seed.service';
import { StartupCheckService } from './application/startup-check.service';
import { UsuarioService } from './application/users/usuario.service';
import { PersistenceModule } from './infrastructure/persistence.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { ClienteGestionController } from './presentation/controllers/cliente-gestion.controller';
import { EmpleadoGestionController } from './presentation/controllers/empleado-gestion.controller';
import { EmpleadoTipoGestionController } from './presentation/controllers/empleado-tipo-gestion.controller';
import { GestionGestionController } from './presentation/controllers/gestion-gestion.controller';
import { GestionController } from './presentation/controllers/gestion.controller';
import { PublicController } from './presentation/controllers/public.controller';
import { RolController } from './presentation/controllers/rol.controller';
import { SupervisorTecnicoGestionController } from './presentation/controllers/supervisor-tecnico-gestion.controller';
import { TipoGestionGestionController } from './presentation/controllers/tipo-gestion-gestion.controller';
import { UsuarioController } from './presentation/controllers/usuario.controller';
import { LoggerModule } from './shared/utils/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    LoggerModule,
    PersistenceModule,
    SecurityModule,
    MicroservicesModule,
  ],
  controllers: [
    AuthController,
    UsuarioController,
    RolController,
    PublicController,
    GestionController,
    ClienteGestionController,
    EmpleadoTipoGestionController,
    EmpleadoGestionController,
    SupervisorTecnicoGestionController,
    TipoGestionGestionController,
    GestionGestionController,
  ],
  providers: [
    AuthService,
    UsuarioService,
    RolService,
    StartupCheckService,
    SeedService,
  ],
})
export class AppModule {}
