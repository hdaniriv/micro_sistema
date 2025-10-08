import { BaseEntity } from './base.entity';

export class Rol extends BaseEntity {
  nombre: string;
  descripcion?: string;

  constructor(nombre: string, descripcion?: string, idUsuarioCreador?: number) {
    super(idUsuarioCreador);
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  updateDescription(descripcion: string): void {
    this.descripcion = descripcion;
    this.updateModificationDate();
  }

  isSystemRole(): boolean {
    const systemRoles = ['Administrador', 'Supervisor', 'Tecnico', 'Cliente'];
    return systemRoles.includes(this.nombre);
  }
}
