import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('IntentoAcceso')
export class IntentoAccesoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ length: 45, nullable: true })
  ip?: string;

  @Column({ length: 255, nullable: true })
  dispositivo?: string;
}
