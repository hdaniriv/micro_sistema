import { IntentoAcceso } from '../entities/intento-acceso.entity';

export interface IIntentoAccesoRepository {
  findAll(): Promise<IntentoAcceso[]>;
  findById(id: number): Promise<IntentoAcceso | null>;
  findByUsername(username: string): Promise<IntentoAcceso[]>;
  findByIp(ip: string): Promise<IntentoAcceso[]>;
  create(intentoAcceso: IntentoAcceso): Promise<IntentoAcceso>;
  findRecentAttempts(minutes: number): Promise<IntentoAcceso[]>;
  countAttemptsByIp(ip: string, minutes?: number): Promise<number>;
  countAttemptsByUsername(username: string, minutes?: number): Promise<number>;
  findSuspiciousActivity(hours?: number): Promise<IntentoAcceso[]>;
  cleanOldAttempts(days: number): Promise<number>;
}
