import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RolEntity } from './rol.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity('UsuarioRol')
export class UsuarioRolEntity extends BaseEntity {
  @Column()
  idUsuario: number;

  @Column()
  idRol: number;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.usuarioRoles, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'idUsuario' })
  usuario: UsuarioEntity;

  @ManyToOne(() => RolEntity, rol => rol.usuarioRoles, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'idRol' })
  rol: RolEntity;

  @ManyToOne(() => UsuarioEntity, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;
}
