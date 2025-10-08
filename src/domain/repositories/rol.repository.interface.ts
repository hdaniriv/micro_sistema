import { Rol } from '../entities/rol.entity';

export interface IRolRepository {
  findAll(): Promise<Rol[]>;
  findById(id: number): Promise<Rol | null>;
  findByName(nombre: string): Promise<Rol | null>;
  create(rol: Rol): Promise<Rol>;
  update(id: number, rol: Partial<Rol>): Promise<Rol | null>;
  delete(id: number): Promise<boolean>;
  findSystemRoles(): Promise<Rol[]>;
  existsByName(nombre: string): Promise<boolean>;
}
