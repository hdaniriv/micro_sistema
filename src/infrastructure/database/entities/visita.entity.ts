import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioEntity } from './usuario.entity';

@Entity('Visita')
export class VisitaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idUsuario: number;

  @Column({ length: 100 })
  username: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ length: 45, nullable: true })
  ip?: string;

  @Column({ length: 255, nullable: true })
  dispositivo?: string;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.visitas, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'idUsuario' })
  usuario: UsuarioEntity;
}
