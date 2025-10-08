import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolEntity } from '../database/entities/rol.entity';
import { IRolRepository } from '../../domain/repositories/rol.repository.interface';
import { Rol } from '../../domain/entities/rol.entity';

@Injectable()
export class RolRepository implements IRolRepository {
  constructor(
    @InjectRepository(RolEntity)
    private readonly rolEntityRepository: Repository<RolEntity>
  ) {}

  async findAll(): Promise<Rol[]> {
    const entities = await this.rolEntityRepository.find();
    return entities.map(this.toDomainEntity);
  }

  async findById(id: number): Promise<Rol | null> {
    const entity = await this.rolEntityRepository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByName(nombre: string): Promise<Rol | null> {
    const entity = await this.rolEntityRepository.findOne({
      where: { nombre },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async create(rol: Rol): Promise<Rol> {
    const entity = this.toEntityFromDomain(rol);
    const savedEntity = await this.rolEntityRepository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async update(id: number, rol: Partial<Rol>): Promise<Rol | null> {
    await this.rolEntityRepository.update(id, rol as any);
    const updatedEntity = await this.rolEntityRepository.findOne({
      where: { id },
    });
    return updatedEntity ? this.toDomainEntity(updatedEntity) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.rolEntityRepository.delete(id);
    return result.affected > 0;
  }

  async findSystemRoles(): Promise<Rol[]> {
    const systemRoles = ['Administrador', 'Supervisor', 'Tecnico', 'Cliente'];
    const entities = await this.rolEntityRepository
      .createQueryBuilder('rol')
      .where('rol.nombre IN (:...nombres)', { nombres: systemRoles })
      .getMany();

    return entities.map(this.toDomainEntity);
  }

  async existsByName(nombre: string): Promise<boolean> {
    const count = await this.rolEntityRepository.count({ where: { nombre } });
    return count > 0;
  }

  private toDomainEntity(entity: RolEntity): Rol {
    const rol = new Rol(
      entity.nombre,
      entity.descripcion,
      entity.idUsuarioCreador
    );
    rol.id = entity.id;
    rol.fechaCreacion = entity.fechaCreacion;
    rol.fechaModificacion = entity.fechaModificacion;
    return rol;
  }

  private toEntityFromDomain(domain: Rol): RolEntity {
    const entity = new RolEntity();
    entity.nombre = domain.nombre;
    entity.descripcion = domain.descripcion;
    entity.idUsuarioCreador = domain.idUsuarioCreador;
    return entity;
  }
}
