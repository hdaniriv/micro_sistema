import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntentoAcceso } from '../../domain/entities/intento-acceso.entity';
import { IIntentoAccesoRepository } from '../../domain/repositories/intento-acceso.repository.interface';
import { IntentoAccesoEntity } from '../database/entities/intento-acceso.entity';

@Injectable()
export class IntentoAccesoRepository implements IIntentoAccesoRepository {
  constructor(
    @InjectRepository(IntentoAccesoEntity)
    private readonly repository: Repository<IntentoAccesoEntity>
  ) {}

  async findAll(): Promise<IntentoAcceso[]> {
    const entities = await this.repository.find({
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findById(id: number): Promise<IntentoAcceso | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUsername(username: string): Promise<IntentoAcceso[]> {
    const entities = await this.repository.find({
      where: { username },
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async findByIp(ip: string): Promise<IntentoAcceso[]> {
    const entities = await this.repository.find({
      where: { ip },
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async create(intentoAcceso: IntentoAcceso): Promise<IntentoAcceso> {
    const entity = this.toEntity(intentoAcceso);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findRecentAttempts(minutes: number): Promise<IntentoAcceso[]> {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    const entities = await this.repository.find({
      where: {
        fecha: cutoffDate as any
      },
      order: { fecha: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async countAttemptsByIp(ip: string, minutes: number = 15): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    return await this.repository.count({
      where: {
        ip,
        fecha: cutoffDate as any
      }
    });
  }

  async countAttemptsByUsername(username: string, minutes: number = 15): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setMinutes(cutoffDate.getMinutes() - minutes);

    return await this.repository.count({
      where: {
        username,
        fecha: cutoffDate as any
      }
    });
  }

  async findSuspiciousActivity(hours: number = 24): Promise<IntentoAcceso[]> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);

    // Buscar múltiples intentos desde la misma IP o con el mismo username
    const entities = await this.repository
      .createQueryBuilder('intento')
      .where('intento.fecha >= :cutoffDate', { cutoffDate })
      .groupBy('intento.ip')
      .having('COUNT(*) >= 3')
      .orWhere('intento.fecha >= :cutoffDate', { cutoffDate })
      .groupBy('intento.username')
      .having('COUNT(*) >= 3')
      .orderBy('intento.fecha', 'DESC')
      .getMany();

    return entities.map(entity => this.toDomain(entity));
  }

  async cleanOldAttempts(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.repository.delete({
      fecha: cutoffDate as any
    });

    return result.affected || 0;
  }

  private toDomain(entity: IntentoAccesoEntity): IntentoAcceso {
    const domain = new IntentoAcceso(
      entity.username,
      entity.password,
      entity.ip,
      entity.dispositivo
    );
    domain.id = entity.id;
    domain.fecha = entity.fecha;
    return domain;
  }

  private toEntity(domain: IntentoAcceso): IntentoAccesoEntity {
    const entity = new IntentoAccesoEntity();
    entity.username = domain.username;
    entity.password = domain.password;
    entity.fecha = domain.fecha;
    entity.ip = domain.ip;
    entity.dispositivo = domain.dispositivo;
    return entity;
  }
}