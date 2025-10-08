import { BaseEntity } from './base.entity';

export class TokenRecuperacion extends BaseEntity {
  idUsuario: number;
  token: string;
  fechaExpiracion: Date;
  usado: boolean;

  constructor(
    idUsuario: number,
    token: string,
    expirationHours: number = 2,
    idUsuarioCreador?: number
  ) {
    super(idUsuarioCreador);
    this.idUsuario = idUsuario;
    this.token = token;
    this.fechaExpiracion = new Date(
      Date.now() + expirationHours * 60 * 60 * 1000
    );
    this.usado = false;
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
