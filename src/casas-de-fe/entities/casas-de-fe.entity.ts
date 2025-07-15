import { Asistencia } from 'src/asistencias/entities/asistencia.entity';
import { MiembroCasaDeFe } from 'src/miembro-casa-de-fe/entities/miembro-casa-de-fe.entity';
import { Miembro } from 'src/miembros/entities/miembro.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
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

  @Column()
  direccion: string;

  @OneToMany(() => Asistencia, (asistencia) => asistencia.casasDeFe)
  asistencias: Asistencia[];
  @OneToMany(() => MiembroCasaDeFe, (miembroCasa) => miembroCasa.casasDeFe)
  miembros: MiembroCasaDeFe[];
}
