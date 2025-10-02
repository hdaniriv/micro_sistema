import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';

@Entity('TokenRecuperacion')
export class TokenRecuperacionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUsuario: number;

  @Column({ length: 255 })
  token: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @Column({ type: 'datetime' })
  fechaExpiracion: Date;

  @Column({ default: false })
  usado: boolean;

  @Column({ nullable: true })
  idUsuarioCreador?: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.tokensRecuperacion)
  @JoinColumn({ name: 'idUsuario' })
  usuario: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;
}