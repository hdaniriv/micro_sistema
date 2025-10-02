import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';

@Entity('IntentoAcceso')
export class IntentoAccesoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  idUsuario?: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column()
  exito: boolean;

  @Column({ length: 45, nullable: true })
  ip?: string;

  @Column({ length: 255, nullable: true })
  userAgent?: string;

  @Column({ length: 200, nullable: true })
  motivo?: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaModificacion: Date;

  @Column({ nullable: true })
  idUsuarioCreador?: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.intentosAcceso, { nullable: true })
  @JoinColumn({ name: 'idUsuario' })
  usuario?: UsuarioEntity;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;
}