import { Visita } from '../entities/visita.entity';

export interface IVisitaRepository {
  findAll(): Promise<Visita[]>;
  findById(id: number): Promise<Visita | null>;
  findByUserId(userId: number): Promise<Visita[]>;
  findByIp(ip: string): Promise<Visita[]>;
  create(visita: Visita): Promise<Visita>;
  findRecentVisits(minutes: number): Promise<Visita[]>;
  findUserVisitsInRange(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Visita[]>;
  cleanOldVisits(days: number): Promise<number>;
}
