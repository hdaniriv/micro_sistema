import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRolRepository } from '../domain/repositories/rol.repository.interface';
import { IUsuarioRepository } from '../domain/repositories/usuario.repository.interface';
import { CreateRolDto, CreateUsuarioDto } from '../presentation/dto';
import { RolService } from './roles/rol.service';
import { UsuarioService } from './users/usuario.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly config: ConfigService,
    private readonly rolService: RolService,
    private readonly usuarioService: UsuarioService,
    @Inject('IRolRepository') private readonly rolRepository: IRolRepository,
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository
  ) {}

  async onApplicationBootstrap() {
    const shouldSeed = this.config.get<string>('DB_SEED', 'false') === 'true';
    if (!shouldSeed) return;
    console.log('[SeedService] Iniciando seeding de base de datos...');

    // 1) Roles por defecto
    const defaultRoles: Array<CreateRolDto> = [
      { nombre: 'Administrador', descripcion: 'Acceso completo al sistema' },
      {
        nombre: 'Supervisor',
        descripcion: 'Supervisión de operaciones y técnicos',
      },
      { nombre: 'Tecnico', descripcion: 'Ejecución de tareas técnicas' },
      { nombre: 'Cliente', descripcion: 'Acceso limitado para clientes' },
    ];

    for (const rol of defaultRoles) {
      const exists = await this.rolRepository.existsByName(rol.nombre);
      if (!exists) {
        try {
          await this.rolService.create(rol);
          console.log(`[SeedService] Rol creado: ${rol.nombre}`);
        } catch {
          // si falla por carrera/duplicado, continuar
        }
      }
    }

    // 2) Usuario admin por defecto
    const adminUsername = 'admin';
    const adminEmail = 'admin@sistema.com';
    const adminNombre = 'Administrador del Sistema';
    const adminPassword = 'admin123';

    let admin = await this.usuarioRepository.findByUsername(adminUsername);
    if (!admin) {
      const dto: CreateUsuarioDto = {
        username: adminUsername,
        password: adminPassword,
        email: adminEmail,
        nombre: adminNombre,
      };
      try {
        await this.usuarioService.create(dto);
        admin = await this.usuarioRepository.findByUsername(adminUsername);
        console.log('[SeedService] Usuario admin creado');
      } catch {
        // ignorar si ya existe por carrera
        admin = await this.usuarioRepository.findByUsername(adminUsername);
      }
    }

    // 3) Asignar rol Administrador
    if (admin?.id) {
      const adminRole = await this.rolRepository.findByName('Administrador');
      if (adminRole?.id) {
        try {
          await this.usuarioService.assignRole(admin.id, adminRole.id);
          console.log(
            '[SeedService] Rol Administrador asignado al usuario admin'
          );
        } catch {
          // ya asignado o fallo menor, continuar
        }
      }
    }
    console.log('[SeedService] Seeding finalizado');
  }
}
