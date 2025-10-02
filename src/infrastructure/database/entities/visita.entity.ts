import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';

@Entity('Visita')
export class VisitaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  idUsuario?: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ length: 45, nullable: true })
  ip?: string;

  @Column({ length: 255, nullable: true })
  userAgent?: string;

  @Column({ length: 100, nullable: true })
  pagina?: string;

  @Column({ length: 500, nullable: true })
  detalles?: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaModificacion: Date;

  @Column({ nullable: true })
  idUsuarioCreador?: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.visitas, { nullable: true })
  @JoinColumn({ name: 'idUsuario' })
  usuario?: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;
}