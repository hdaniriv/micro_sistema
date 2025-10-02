export class TokenRecuperacion {
  id: number;
  idUsuario: number;
  token: string;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  usado: boolean;
  idUsuarioCreador?: number;

  constructor(
    idUsuario: number,
    token: string,
    expirationHours: number = 2,
    idUsuarioCreador?: number
  ) {
    this.idUsuario = idUsuario;
    this.token = token;
    this.fechaCreacion = new Date();
    this.fechaExpiracion = new Date(Date.now() + (expirationHours * 60 * 60 * 1000));
    this.usado = false;
    this.idUsuarioCreador = idUsuarioCreador;
  }

  isValid(): boolean {
    return !this.usado && !this.isExpired();
  }

  isExpired(): boolean {
    return new Date() > this.fechaExpiracion;
  }

  markAsUsed(): void {
    this.usado = true;
  }

  canBeUsed(): boolean {
    return this.isValid();
  }
}