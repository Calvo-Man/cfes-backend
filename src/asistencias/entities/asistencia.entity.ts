import { CasasDeFe } from 'src/casas-de-fe/entities/casas-de-fe.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Asistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // o 'timestamp' si quieres incluir hora
  nombre: string;

  @Column() // o 'timestamp' si quieres incluir hora
  apellido: string;

  @Column() // o 'timestamp' si quieres incluir hora
  telefono: string;

  @Column() // o 'timestamp' si quieres incluir hora
  direccion: string;

  @Column() // o 'timestamp' si quieres incluir hora
  barrio: string;

  @Column()
  mensaje_enviado: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @ManyToOne(() => CasasDeFe, (casasDeFe) => casasDeFe.asistencias)
  casasDeFe: CasasDeFe;
}
