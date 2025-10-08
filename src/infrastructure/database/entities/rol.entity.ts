import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioRolEntity } from './usuario-rol.entity';

@Entity('Rol')
export class RolEntity extends BaseEntity {
  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  descripcion?: string;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;

  @OneToMany(() => UsuarioRolEntity, usuarioRol => usuarioRol.rol)
  usuarioRoles: UsuarioRolEntity[];
}
