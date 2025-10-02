export class Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  idUsuarioCreador?: number;

  constructor(
    nombre: string,
    descripcion?: string,
    idUsuarioCreador?: number
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    this.idUsuarioCreador = idUsuarioCreador;
  }

  updateDescription(descripcion: string): void {
    this.descripcion = descripcion;
    this.fechaModificacion = new Date();
  }

  isSystemRole(): boolean {
    const systemRoles = ['Administrador', 'Supervisor', 'Tecnico', 'Cliente'];
    return systemRoles.includes(this.nombre);
  }
}