import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../database/entities/usuario.entity';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository.interface';
import { Usuario } from '../../domain/entities/usuario.entity';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioEntityRepository: Repository<UsuarioEntity>
  ) {}

  async findAll(): Promise<Usuario[]> {
    const entities = await this.usuarioEntityRepository.find();
    return entities.map(this.toDomainEntity);
  }

  async findById(id: number): Promise<Usuario | null> {
    const entity = await this.usuarioEntityRepository.findOne({
      where: { id },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    const entity = await this.usuarioEntityRepository.findOne({
      where: { username },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const entity = await this.usuarioEntityRepository.findOne({
      where: { email },
    });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const entity = this.toEntityFromDomain(usuario);
    const savedEntity = await this.usuarioEntityRepository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario | null> {
    await this.usuarioEntityRepository.update(id, usuario as any);
    const updatedEntity = await this.usuarioEntityRepository.findOne({
      where: { id },
    });
    return updatedEntity ? this.toDomainEntity(updatedEntity) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.usuarioEntityRepository.delete(id);
    return result.affected > 0;
  }

  async findByRole(roleId: number): Promise<Usuario[]> {
    const entities = await this.usuarioEntityRepository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.usuarioRoles', 'usuarioRol')
      .where('usuarioRol.idRol = :roleId', { roleId })
      .getMany();

    return entities.map(this.toDomainEntity);
  }

  async findActiveUsers(): Promise<Usuario[]> {
    const entities = await this.usuarioEntityRepository.find({
      where: { activo: true },
    });
    return entities.map(this.toDomainEntity);
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.usuarioEntityRepository.count({
      where: { username },
    });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.usuarioEntityRepository.count({
      where: { email },
    });
    return count > 0;
  }

  private toDomainEntity(entity: UsuarioEntity): Usuario {
    const usuario = new Usuario(
      entity.username,
      entity.password,
      entity.email,
      entity.nombre,
      entity.idUsuarioCreador
    );
    usuario.id = entity.id;
    usuario.activo = entity.activo;
    usuario.fechaCreacion = entity.fechaCreacion;
    usuario.fechaModificacion = entity.fechaModificacion;
    return usuario;
  }

  private toEntityFromDomain(domain: Usuario): UsuarioEntity {
    const entity = new UsuarioEntity();
    entity.username = domain.username;
    entity.password = domain.password;
    entity.email = domain.email;
    entity.nombre = domain.nombre;
    entity.activo = domain.activo;
    entity.idUsuarioCreador = domain.idUsuarioCreador;
    return entity;
  }
}
