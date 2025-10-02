export class IntentoAcceso {
  id: number;
  idUsuario?: number;
  fecha: Date;
  exito: boolean;
  ip?: string;
  userAgent?: string;
  motivo?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  idUsuarioCreador?: number;

  constructor(
    exito: boolean,
    idUsuario?: number,
    ip?: string,
    userAgent?: string,
    motivo?: string,
    idUsuarioCreador?: number
  ) {
    this.idUsuario = idUsuario;
    this.fecha = new Date();
    this.exito = exito;
    this.ip = ip;
    this.userAgent = userAgent;
    this.motivo = motivo;
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    this.idUsuarioCreador = idUsuarioCreador;
  }

  wasSuccessful(): boolean {
    return this.exito;
  }

  isSuspicious(): boolean {
    return !this.exito && (
      this.motivo?.includes('password') ||
      this.motivo?.includes('brute') ||
      this.motivo?.includes('blocked')
    );
  }
}