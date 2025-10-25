import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity('TokenRecuperacion')
export class TokenRecuperacionEntity extends BaseEntity {
  @Column()
  idUsuario: number;

  @Column({ length: 255 })
  token: string;

  @Column({ type: 'datetime' })
  fechaExpiracion: Date;

  @Column({ default: false })
  usado: boolean;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.tokensRecuperacion, {
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
