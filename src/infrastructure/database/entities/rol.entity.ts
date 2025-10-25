import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsuarioRolEntity } from './usuario-rol.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity('Rol')
export class RolEntity extends BaseEntity {
  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  descripcion?: string;

  @ManyToOne(() => UsuarioEntity, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'idUsuarioCreador' })
  usuarioCreador?: UsuarioEntity;

  @OneToMany(() => UsuarioRolEntity, usuarioRol => usuarioRol.rol)
  usuarioRoles: UsuarioRolEntity[];
}
