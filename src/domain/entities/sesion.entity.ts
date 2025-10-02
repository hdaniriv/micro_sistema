export class Sesion {
  id: number;
  idUsuario: number;
  token: string;
  fechaInicio: Date;
  fechaFin?: Date;
  ip?: string;
  userAgent?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  idUsuarioCreador?: number;

  constructor(
    idUsuario: number,
    token: string,
    ip?: string,
    userAgent?: string,
    idUsuarioCreador?: number
  ) {
    this.idUsuario = idUsuario;
    this.token = token;
    this.fechaInicio = new Date();
    this.ip = ip;
    this.userAgent = userAgent;
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    this.idUsuarioCreador = idUsuarioCreador;
  }

  isActive(): boolean {
    return !this.fechaFin;
  }

  terminate(): void {
    this.fechaFin = new Date();
    this.fechaModificacion = new Date();
  }

  isExpired(expirationHours: number = 24): boolean {
    if (this.fechaFin) return true;
    
    const now = new Date();
    const expirationTime = new Date(this.fechaInicio.getTime() + (expirationHours * 60 * 60 * 1000));
    return now > expirationTime;
  }
}