import { IntentoAcceso } from '../entities/intento-acceso.entity';

export interface IIntentoAccesoRepository {
  findAll(): Promise<IntentoAcceso[]>;
  findById(id: number): Promise<IntentoAcceso | null>;
  findByUserId(userId: number): Promise<IntentoAcceso[]>;
  findByIp(ip: string): Promise<IntentoAcceso[]>;
  create(intentoAcceso: IntentoAcceso): Promise<IntentoAcceso>;
  findFailedAttempts(userId?: number, ip?: string, minutes?: number): Promise<IntentoAcceso[]>;
  findRecentAttempts(minutes: number): Promise<IntentoAcceso[]>;
  countFailedAttempts(userId?: number, ip?: string, minutes?: number): Promise<number>;
  findSuspiciousActivity(hours?: number): Promise<IntentoAcceso[]>;
  cleanOldAttempts(days: number): Promise<number>;
}