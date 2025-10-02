export class Visita {
  id: number;
  idUsuario?: number;
  fecha: Date;
  ip?: string;
  userAgent?: string;
  pagina?: string;
  detalles?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  idUsuarioCreador?: number;

  constructor(
    pagina?: string,
    idUsuario?: number,
    ip?: string,
    userAgent?: string,
    detalles?: string,
    idUsuarioCreador?: number
  ) {
    this.idUsuario = idUsuario;
    this.fecha = new Date();
    this.ip = ip;
    this.userAgent = userAgent;
    this.pagina = pagina;
    this.detalles = detalles;
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    this.idUsuarioCreador = idUsuarioCreador;
  }

  isAnonymous(): boolean {
    return !this.idUsuario;
  }

  isFromUser(): boolean {
    return !!this.idUsuario;
  }

  updateDetails(detalles: string): void {
    this.detalles = detalles;
    this.fechaModificacion = new Date();
  }
}