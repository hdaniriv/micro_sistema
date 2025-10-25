import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity('Sesion')
export class SesionEntity extends BaseEntity {
  @Column()
  idUsuario: number;

  @Column({ length: 255 })
  token: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaInicio: Date;

  @Column({ type: 'datetime', nullable: true })
  fechaFin?: Date;

  @Column({ length: 45, nullable: true })
  ip?: string;

  @Column({ length: 255, nullable: true })
  userAgent?: string;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.sesiones, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'idUsuario' })
  usuario: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;
}
