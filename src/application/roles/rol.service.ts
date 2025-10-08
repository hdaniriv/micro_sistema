import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IRolRepository } from '../../domain/repositories/rol.repository.interface';
import { Rol } from '../../domain/entities/rol.entity';
import {
  CreateRolDto,
  UpdateRolDto,
  RolResponseDto,
} from '../../presentation/dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RolService {
  constructor(
    @Inject('IRolRepository')
    private readonly rolRepository: IRolRepository
  ) {}

  async findAll(): Promise<RolResponseDto[]> {
    const roles = await this.rolRepository.findAll();
    return roles.map(rol =>
      plainToClass(RolResponseDto, rol, { excludeExtraneousValues: true })
    );
  }

  async findById(id: number): Promise<RolResponseDto> {
    const rol = await this.rolRepository.findById(id);
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return plainToClass(RolResponseDto, rol, { excludeExtraneousValues: true });
  }

  async create(
    createRolDto: CreateRolDto,
    creatorId?: number
  ): Promise<RolResponseDto> {
    const { nombre, descripcion } = createRolDto;

    // Verificar que el nombre no exista
    const existingRol = await this.rolRepository.existsByName(nombre);
    if (existingRol) {
      throw new ConflictException('Ya existe un rol con este nombre');
    }

    // Crear rol
    const rol = new Rol(nombre, descripcion, creatorId);
    const savedRol = await this.rolRepository.create(rol);

    return plainToClass(RolResponseDto, savedRol, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: number,
    updateRolDto: UpdateRolDto
  ): Promise<RolResponseDto> {
    const existingRol = await this.rolRepository.findById(id);
    if (!existingRol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Verificar nombre único si se está actualizando
    if (updateRolDto.nombre && updateRolDto.nombre !== existingRol.nombre) {
      const existingRolByName = await this.rolRepository.existsByName(
        updateRolDto.nombre
      );
      if (existingRolByName) {
        throw new ConflictException('Ya existe un rol con este nombre');
      }
    }

    const updatedRol = await this.rolRepository.update(id, updateRolDto);
    if (!updatedRol) {
      throw new BadRequestException('Error al actualizar el rol');
    }

    return plainToClass(RolResponseDto, updatedRol, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const existingRol = await this.rolRepository.findById(id);
    if (!existingRol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Verificar si es un rol del sistema
    if (existingRol.isSystemRole()) {
      throw new BadRequestException('No se puede eliminar un rol del sistema');
    }

    const deleted = await this.rolRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('Error al eliminar el rol');
    }
  }

  async findSystemRoles(): Promise<RolResponseDto[]> {
    const roles = await this.rolRepository.findSystemRoles();
    return roles.map(rol =>
      plainToClass(RolResponseDto, rol, { excludeExtraneousValues: true })
    );
  }

  async findByName(nombre: string): Promise<RolResponseDto | null> {
    const rol = await this.rolRepository.findByName(nombre);
    if (!rol) {
      return null;
    }

    return plainToClass(RolResponseDto, rol, { excludeExtraneousValues: true });
  }
}
