import { BaseEntity } from './base.entity';

export class Usuario extends BaseEntity {
  username: string;
  password: string;
  email?: string;
  nombre?: string;
  activo: boolean;

  constructor(
    username: string,
    password: string,
    email?: string,
    nombre?: string,
    idUsuarioCreador?: number
  ) {
    super(idUsuarioCreador);
    this.username = username;
    this.password = password;
    this.email = email;
    this.nombre = nombre;
    this.activo = true;
  }

  isActive(): boolean {
    return this.activo;
  }

  deactivate(): void {
    this.activo = false;
    this.updateModificationDate();
  }

  activate(): void {
    this.activo = true;
    this.updateModificationDate();
  }

  updateProfile(email?: string, nombre?: string): void {
    if (email) this.email = email;
    if (nombre) this.nombre = nombre;
    this.updateModificationDate();
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
    this.updateModificationDate();
  }
}
