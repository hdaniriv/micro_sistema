import { Usuario } from '../entities/usuario.entity';

export interface IUsuarioRepository {
  findAll(): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  findByUsername(username: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(usuario: Usuario): Promise<Usuario>;
  update(id: number, usuario: Partial<Usuario>): Promise<Usuario | null>;
  delete(id: number): Promise<boolean>;
  findByRole(roleId: number): Promise<Usuario[]>;
  findActiveUsers(): Promise<Usuario[]>;
  existsByUsername(username: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
}