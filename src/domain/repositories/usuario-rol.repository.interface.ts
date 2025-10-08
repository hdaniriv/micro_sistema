import { UsuarioRol } from '../entities/usuario-rol.entity';

export interface IUsuarioRolRepository {
  findAll(): Promise<UsuarioRol[]>;
  findById(id: number): Promise<UsuarioRol | null>;
  findByUserId(userId: number): Promise<UsuarioRol[]>;
  findByRoleId(roleId: number): Promise<UsuarioRol[]>;
  create(usuarioRol: UsuarioRol): Promise<UsuarioRol>;
  delete(id: number): Promise<boolean>;
  deleteByUserAndRole(userId: number, roleId: number): Promise<boolean>;
  findUserRoles(userId: number): Promise<UsuarioRol[]>;
  existsUserRole(userId: number, roleId: number): Promise<boolean>;
  assignRole(
    userId: number,
    roleId: number,
    creatorId?: number
  ): Promise<UsuarioRol>;
  removeRole(userId: number, roleId: number): Promise<boolean>;
}
