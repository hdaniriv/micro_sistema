import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository.interface';
import { IUsuarioRolRepository } from '../../domain/repositories/usuario-rol.repository.interface';
import { IRolRepository } from '../../domain/repositories/rol.repository.interface';
import { Usuario } from '../../domain/entities/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto, UsuarioResponseDto, ChangePasswordDto } from '../../presentation/dto';
import { CryptoService } from '../../shared/utils/crypto.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    @Inject('IUsuarioRolRepository')
    private readonly usuarioRolRepository: IUsuarioRolRepository,
    @Inject('IRolRepository')
    private readonly rolRepository: IRolRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async findAll(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioRepository.findAll();
    return usuarios.map(usuario => 
      plainToClass(UsuarioResponseDto, usuario, { excludeExtraneousValues: true })
    );
  }

  async findById(id: number): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return plainToClass(UsuarioResponseDto, usuario, { excludeExtraneousValues: true });
  }

  async create(createUsuarioDto: CreateUsuarioDto, creatorId?: number): Promise<UsuarioResponseDto> {
    const { username, password, email, nombre } = createUsuarioDto;

    // Verificar que el username no exista
    const existingUserByUsername = await this.usuarioRepository.existsByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    // Verificar que el email no exista (si se proporciona)
    if (email) {
      const existingUserByEmail = await this.usuarioRepository.existsByEmail(email);
      if (existingUserByEmail) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
    }

    // Encriptar contraseña
    const hashedPassword = await this.cryptoService.hashPassword(password);

    // Crear usuario
    const usuario = new Usuario(username, hashedPassword, email, nombre, creatorId);
    const savedUsuario = await this.usuarioRepository.create(usuario);

    return plainToClass(UsuarioResponseDto, savedUsuario, { excludeExtraneousValues: true });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioResponseDto> {
    const existingUser = await this.usuarioRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar email único si se está actualizando
    if (updateUsuarioDto.email && updateUsuarioDto.email !== existingUser.email) {
      const existingUserByEmail = await this.usuarioRepository.existsByEmail(updateUsuarioDto.email);
      if (existingUserByEmail) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
    }

    const updatedUser = await this.usuarioRepository.update(id, updateUsuarioDto);
    if (!updatedUser) {
      throw new BadRequestException('Error al actualizar el usuario');
    }

    return plainToClass(UsuarioResponseDto, updatedUser, { excludeExtraneousValues: true });
  }

  async delete(id: number): Promise<void> {
    const existingUser = await this.usuarioRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const deleted = await this.usuarioRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('Error al eliminar el usuario');
    }
  }

  async assignRole(userId: number, roleId: number, creatorId?: number): Promise<void> {
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const role = await this.rolRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const existingAssignment = await this.usuarioRolRepository.existsUserRole(userId, roleId);
    if (existingAssignment) {
      throw new ConflictException('El usuario ya tiene asignado este rol');
    }

    await this.usuarioRolRepository.assignRole(userId, roleId, creatorId);
  }

  async removeRole(userId: number, roleId: number): Promise<void> {
    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const existingAssignment = await this.usuarioRolRepository.existsUserRole(userId, roleId);
    if (!existingAssignment) {
      throw new BadRequestException('El usuario no tiene asignado este rol');
    }

    const removed = await this.usuarioRolRepository.removeRole(userId, roleId);
    if (!removed) {
      throw new BadRequestException('Error al remover el rol del usuario');
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usuarioRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await this.cryptoService.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Encriptar nueva contraseña
    const hashedNewPassword = await this.cryptoService.hashPassword(newPassword);

    // Actualizar contraseña
    await this.usuarioRepository.update(userId, { password: hashedNewPassword });
  }

  async findActiveUsers(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioRepository.findActiveUsers();
    return usuarios.map(usuario => 
      plainToClass(UsuarioResponseDto, usuario, { excludeExtraneousValues: true })
    );
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.usuarioRolRepository.findByUserId(userId);
    const roles = await Promise.all(
      userRoles.map(async (ur) => {
        const rol = await this.rolRepository.findById(ur.idRol);
        return rol?.nombre || '';
      })
    );

    return roles.filter(role => role !== '');
  }
}