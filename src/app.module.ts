import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from './infrastructure/persistence.module';
import { SecurityModule } from './application/security.module';
import { AuthService } from './application/auth/auth.service';
import { UsuarioService } from './application/users/usuario.service';
import { RolService } from './application/roles/rol.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { UsuarioController } from './presentation/controllers/usuario.controller';
import { RolController } from './presentation/controllers/rol.controller';
import { PublicController } from './presentation/controllers/public.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './presentation/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    }),
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