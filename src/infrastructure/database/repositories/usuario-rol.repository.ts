import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioRolEntity } from '../entities/usuario-rol.entity';
import { IUsuarioRolRepository } from '../../../domain/repositories/usuario-rol.repository.interface';
import { UsuarioRol } from '../../../domain/entities/usuario-rol.entity';

@Injectable()
export class UsuarioRolRepository implements IUsuarioRolRepository {
  constructor(
    @InjectRepository(UsuarioRolEntity)
    private readonly usuarioRolEntityRepository: Repository<UsuarioRolEntity>,
  ) {}

  async findAll(): Promise<UsuarioRol[]> {
    const entities = await this.usuarioRolEntityRepository.find();
    return entities.map(this.toDomainEntity);
  }

  async findById(id: number): Promise<UsuarioRol | null> {
    const entity = await this.usuarioRolEntityRepository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  async findByUserId(userId: number): Promise<UsuarioRol[]> {
    const entities = await this.usuarioRolEntityRepository.find({ where: { idUsuario: userId } });
    return entities.map(this.toDomainEntity);
  }

  async findByRoleId(roleId: number): Promise<UsuarioRol[]> {
    const entities = await this.usuarioRolEntityRepository.find({ where: { idRol: roleId } });
    return entities.map(this.toDomainEntity);
  }

  async create(usuarioRol: UsuarioRol): Promise<UsuarioRol> {
    const entity = this.toEntityFromDomain(usuarioRol);
    const savedEntity = await this.usuarioRolEntityRepository.save(entity);
    return this.toDomainEntity(savedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.usuarioRolEntityRepository.delete(id);
    return result.affected > 0;
  }

  async deleteByUserAndRole(userId: number, roleId: number): Promise<boolean> {
    const result = await this.usuarioRolEntityRepository.delete({
      idUsuario: userId,
      idRol: roleId
    });
    return result.affected > 0;
  }

  async findUserRoles(userId: number): Promise<UsuarioRol[]> {
    const entities = await this.usuarioRolEntityRepository.find({
      where: { idUsuario: userId },
      relations: ['rol']
    });
    return entities.map(this.toDomainEntity);
  }

  async existsUserRole(userId: number, roleId: number): Promise<boolean> {
    const count = await this.usuarioRolEntityRepository.count({
      where: { idUsuario: userId, idRol: roleId }
    });
    return count > 0;
  }

  async assignRole(userId: number, roleId: number, creatorId?: number): Promise<UsuarioRol> {
    const usuarioRol = new UsuarioRol(userId, roleId, creatorId);
    return this.create(usuarioRol);
  }

  async removeRole(userId: number, roleId: number): Promise<boolean> {
    return this.deleteByUserAndRole(userId, roleId);
  }

  private toDomainEntity(entity: UsuarioRolEntity): UsuarioRol {
    const usuarioRol = new UsuarioRol(
      entity.idUsuario,
      entity.idRol,
      entity.idUsuarioCreador
    );
    usuarioRol.id = entity.id;
    usuarioRol.fechaCreacion = entity.fechaCreacion;
    usuarioRol.fechaModificacion = entity.fechaModificacion;
    return usuarioRol;
  }

  private toEntityFromDomain(domain: UsuarioRol): UsuarioRolEntity {
    const entity = new UsuarioRolEntity();
    entity.idUsuario = domain.idUsuario;
    entity.idRol = domain.idRol;
    entity.idUsuarioCreador = domain.idUsuarioCreador;
    return entity;
  }
}