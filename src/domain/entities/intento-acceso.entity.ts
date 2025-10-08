export class IntentoAcceso {
  id?: number;
  username: string;
  password: string;
  fecha: Date;
  ip?: string;
  dispositivo?: string;

  constructor(
    username: string,
    password: string,
    ip?: string,
    dispositivo?: string
  ) {
    this.username = username;
    this.password = password;
    this.fecha = new Date();
    this.ip = ip;
    this.dispositivo = dispositivo;
  }

  isSuspicious(): boolean {
    return (
      this.password?.length < 3 ||
      this.username?.includes('admin') ||
      this.username?.includes('root')
    );
  }
}
