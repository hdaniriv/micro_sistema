import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './application/auth/auth.service';
import { RolService } from './application/roles/rol.service';
import { SecurityModule } from './application/security.module';
import { UsuarioService } from './application/users/usuario.service';
import { PersistenceModule } from './infrastructure/persistence.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { PublicController } from './presentation/controllers/public.controller';
import { RolController } from './presentation/controllers/rol.controller';
import { UsuarioController } from './presentation/controllers/usuario.controller';
import { RolesGuard } from './presentation/guards/roles.guard';
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
  ],
  controllers: [
    AuthController,
    UsuarioController,
    RolController,
    PublicController,
  ],
  providers: [
    AuthService,
    UsuarioService,
    RolService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
