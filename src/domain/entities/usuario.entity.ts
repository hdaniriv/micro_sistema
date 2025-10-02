export class Usuario {
  id: number;
  username: string;
  password: string;
  email?: string;
  nombre?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;
  idUsuarioCreador?: number;

  constructor(
    username: string,
    password: string,
    email?: string,
    nombre?: string,
    idUsuarioCreador?: number
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.nombre = nombre;
    this.activo = true;
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    this.idUsuarioCreador = idUsuarioCreador;
  }

  isActive(): boolean {
    return this.activo;
  }

  deactivate(): void {
    this.activo = false;
    this.fechaModificacion = new Date();
  }

  activate(): void {
    this.activo = true;
    this.fechaModificacion = new Date();
  }

  updateProfile(email?: string, nombre?: string): void {
    if (email) this.email = email;
    if (nombre) this.nombre = nombre;
    this.fechaModificacion = new Date();
  }

  changePassword(newPassword: string): void {
    this.password = newPassword;
    this.fechaModificacion = new Date();
  }
}