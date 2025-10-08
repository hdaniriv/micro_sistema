import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsuarioEntity } from './usuario.entity';
import { RolEntity } from './rol.entity';

@Entity('UsuarioRol')
export class UsuarioRolEntity extends BaseEntity {
  @Column()
  idUsuario: number;

  @Column()
  idRol: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.usuarioRoles)
  @JoinColumn({ name: 'idUsuario' })
  usuario: UsuarioEntity;

  @ManyToOne(() => RolEntity, rol => rol.usuarioRoles)
  @JoinColumn({ name: 'idRol' })
  rol: RolEntity;

  @ManyToOne(() => UsuarioEntity, { nullable: true })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;
}
