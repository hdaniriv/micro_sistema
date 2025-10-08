import { BaseEntity } from './base.entity';

export class Sesion extends BaseEntity {
  idUsuario: number;
  token: string;
  fechaInicio: Date;
  fechaFin?: Date;
  ip?: string;
  userAgent?: string;

  constructor(
    idUsuario: number,
    token: string,
    ip?: string,
    userAgent?: string,
    idUsuarioCreador?: number
  ) {
    super(idUsuarioCreador);
    this.idUsuario = idUsuario;
    this.token = token;
    this.fechaInicio = new Date();
    this.ip = ip;
    this.userAgent = userAgent;
  }

  isActive(): boolean {
    return !this.fechaFin;
  }

  terminate(): void {
    this.fechaFin = new Date();
    this.updateModificationDate();
  }

  isExpired(expirationHours: number = 24): boolean {
    if (this.fechaFin) return true;

    const now = new Date();
    const expirationTime = new Date(
      this.fechaInicio.getTime() + expirationHours * 60 * 60 * 1000
    );
    return now > expirationTime;
  }
}
