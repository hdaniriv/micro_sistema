import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Visita } from '../../domain/entities/visita.entity';
import { IVisitaRepository } from '../../domain/repositories/visita.repository.interface';
import { VisitaEntity } from '../database/entities/visita.entity';

@Injectable()
export class VisitaRepository implements IVisitaRepository {
  constructor(
    @InjectRepository(VisitaEntity)
    private readonly repository: Repository<VisitaEntity>
  ) {}

  async findAll(): Promise<Visita[]> {
    const entities = await this.repository.find({
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findById(id: number): Promise<Visita | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: number): Promise<Visita[]> {
    const entities = await this.repository.find({
      where: { idUsuario: userId },
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByIp(ip: string): Promise<Visita[]> {
    const entities = await this.repository.find({
      where: { ip },
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async create(visita: Visita): Promise<Visita> {
    const entity = this.toEntity(visita);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findRecentVisits(minutes: number): Promise<Visita[]> {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    const entities = await this.repository.find({
      where: {
        fecha: Between(cutoffDate, new Date())
      },
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findUserVisitsInRange(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Visita[]> {
    const entities = await this.repository.find({
      where: {
        idUsuario: userId,
        fecha: Between(startDate, endDate)
      },
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async cleanOldVisits(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.repository.delete({
      fecha: Between(new Date(0), cutoffDate)
    });

    return result.affected || 0;
  }

  private toDomain(entity: VisitaEntity): Visita {
    const domain = new Visita(
      entity.idUsuario,
      entity.username,
      entity.ip,
      entity.dispositivo
    );
    domain.id = entity.id;
    domain.fecha = entity.fecha;
    return domain;
  }

  private toEntity(domain: Visita): VisitaEntity {
    const entity = new VisitaEntity();
    entity.idUsuario = domain.idUsuario;
    entity.username = domain.username;
    entity.fecha = domain.fecha;
    entity.ip = domain.ip;
    entity.dispositivo = domain.dispositivo;
    return entity;
  }
}