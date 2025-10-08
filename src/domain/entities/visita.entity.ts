export class Visita {
  id?: number;
  idUsuario: number;
  username: string;
  fecha: Date;
  ip?: string;
  dispositivo?: string;

  constructor(
    idUsuario: number,
    username: string,
    ip?: string,
    dispositivo?: string
  ) {
    this.idUsuario = idUsuario;
    this.username = username;
    this.fecha = new Date();
    this.ip = ip;
    this.dispositivo = dispositivo;
  }

  isFromMobileDevice(): boolean {
    if (!this.dispositivo) return false;
    
    return /Mobile|Android|iPhone|iPad|Windows Phone/i.test(this.dispositivo);
  }
}
