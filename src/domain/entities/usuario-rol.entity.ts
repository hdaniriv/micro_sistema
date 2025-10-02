export class UsuarioRol {
  id: number;
  idUsuario: number;
  idRol: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  idUsuarioCreador?: number;

  constructor(
    idUsuario: number,
    idRol: number,
    idUsuarioCreador?: number
  ) {
    this.idUsuario = idUsuario;
    this.idRol = idRol;
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    this.idUsuarioCreador = idUsuarioCreador;
  }

  isValidAssignment(): boolean {
    return this.idUsuario > 0 && this.idRol > 0;
  }
}