import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioRolEntity } from './usuario-rol.entity';
import { SesionEntity } from './sesion.entity';
import { IntentoAccesoEntity } from './intento-acceso.entity';
import { TokenRecuperacionEntity } from './token-recuperacion.entity';
import { VisitaEntity } from './visita.entity';

@Entity('Usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 200 })
  password: string;

  @Column({ unique: true, length: 100, nullable: true })
  email?: string;

  @Column({ length: 100, nullable: true })
  nombre?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaModificacion: Date;

  @Column({ nullable: true })
  idUsuarioCreador?: number;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;

  @OneToMany(() => UsuarioRolEntity, usuarioRol => usuarioRol.usuario)
  usuarioRoles: UsuarioRolEntity[];

  @OneToMany(() => SesionEntity, sesion => sesion.usuario)
  sesiones: SesionEntity[];

  @OneToMany(() => IntentoAccesoEntity, intento => intento.usuario)
  intentosAcceso: IntentoAccesoEntity[];

  @OneToMany(() => TokenRecuperacionEntity, token => token.usuario)
  tokensRecuperacion: TokenRecuperacionEntity[];

  @OneToMany(() => VisitaEntity, visita => visita.usuario)
  visitas: VisitaEntity[];
}