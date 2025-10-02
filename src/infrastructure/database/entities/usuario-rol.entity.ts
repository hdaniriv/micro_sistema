import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';
import { RolEntity } from './rol.entity';

@Entity('UsuarioRol')
export class UsuarioRolEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUsuario: number;

  @Column()
  idRol: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaModificacion: Date;

  @Column({ nullable: true })
  idUsuarioCreador?: number;

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