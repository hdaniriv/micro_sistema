import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsuarioRolEntity } from './usuario-rol.entity';
import { SesionEntity } from './sesion.entity';
import { IntentoAccesoEntity } from './intento-acceso.entity';
import { TokenRecuperacionEntity } from './token-recuperacion.entity';
import { VisitaEntity } from './visita.entity';

@Entity('Usuario')
export class UsuarioEntity extends BaseEntity {
  @Column({ unique: true, length: 50, nullable: true })
  username: string;

  @Column({ length: 200 })
  password: string;

  @Column({ unique: true, length: 100, nullable: true })
  email?: string;

  @Column({ length: 100, nullable: false })
  nombre?: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;

  @OneToMany(() => UsuarioRolEntity, usuarioRol => usuarioRol.usuario)
  usuarioRoles: UsuarioRolEntity[];

  @OneToMany(() => SesionEntity, sesion => sesion.usuario)
  sesiones: SesionEntity[];



  @OneToMany(() => TokenRecuperacionEntity, token => token.usuario)
  tokensRecuperacion: TokenRecuperacionEntity[];

  @OneToMany(() => VisitaEntity, visita => visita.usuario)
  visitas: VisitaEntity[];
}
