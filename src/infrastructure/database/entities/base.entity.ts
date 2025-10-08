import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

//Estructura base para todas las entidades
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  fechaCreacion: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  fechaModificacion: Date;

  @Column({
    name: 'idUsuarioCreador',
    type: 'int',
    nullable: true,
  })
  idUsuarioCreador?: number;
}
