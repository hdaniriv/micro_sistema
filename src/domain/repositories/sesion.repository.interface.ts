import { Sesion } from '../entities/sesion.entity';

export interface ISesionRepository {
  findAll(): Promise<Sesion[]>;
  findById(id: number): Promise<Sesion | null>;
  findByUserId(userId: number): Promise<Sesion[]>;
  findByToken(token: string): Promise<Sesion | null>;
  create(sesion: Sesion): Promise<Sesion>;
  update(id: number, sesion: Partial<Sesion>): Promise<Sesion | null>;
  delete(id: number): Promise<boolean>;
  findActiveSessions(userId: number): Promise<Sesion[]>;
  terminateSession(token: string): Promise<boolean>;
  terminateAllUserSessions(userId: number): Promise<boolean>;
  cleanExpiredSessions(): Promise<number>;
}