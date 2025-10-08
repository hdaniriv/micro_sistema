import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity('TokenRecuperacion')
export class TokenRecuperacionEntity extends BaseEntity {
  @Column()
  idUsuario: number;

  @Column({ length: 255 })
  token: string;

  @Column({ type: 'datetime' })
  fechaExpiracion: Date;

  @Column({ default: false })
  usado: boolean;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.tokensRecuperacion)
  @JoinColumn({ name: 'idUsuario' })
  usuario: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;
}
