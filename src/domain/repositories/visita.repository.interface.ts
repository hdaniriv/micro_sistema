import { Visita } from '../entities/visita.entity';

export interface IVisitaRepository {
  findAll(): Promise<Visita[]>;
  findById(id: number): Promise<Visita | null>;
  findByUserId(userId: number): Promise<Visita[]>;
  findByPage(pagina: string): Promise<Visita[]>;
  create(visita: Visita): Promise<Visita>;
  findAnonymousVisits(): Promise<Visita[]>;
  findUserVisits(): Promise<Visita[]>;
  findVisitsByDateRange(startDate: Date, endDate: Date): Promise<Visita[]>;
  findVisitsByIp(ip: string): Promise<Visita[]>;
  getVisitStats(days?: number): Promise<any>;
  cleanOldVisits(days: number): Promise<number>;
}