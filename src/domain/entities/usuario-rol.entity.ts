import { BaseEntity } from './base.entity';

export class UsuarioRol extends BaseEntity {
  idUsuario: number;
  idRol: number;

  constructor(idUsuario: number, idRol: number, idUsuarioCreador?: number) {
    super(idUsuarioCreador);
    this.idUsuario = idUsuario;
    this.idRol = idRol;
  }

  isValidAssignment(): boolean {
    return this.idUsuario > 0 && this.idRol > 0;
  }
}
