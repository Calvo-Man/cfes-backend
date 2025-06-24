import { Miembro } from 'src/miembros/entities/miembro.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class CasasDeFe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToMany(() => Miembro, (miembro) => miembro.casasDeFe)
  @JoinTable() // Esta entidad es la dueña de la relación
  encargadosId: Miembro[];

  @Column('float')
  latitud: number;

  @Column('float')
  longitud: number;
}
