import { Aseo } from 'src/aseos/entities/aseo.entity';
import { CasasDeFe } from 'src/casas-de-fe/entities/casas-de-fe.entity';
import { Rol } from 'src/roles/enum/roles.enum';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Miembro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  name: string;

  @Column({ length: 80 })
  apellido: string;

  @Column({ length: 80, unique: true })
  user: string;

  @Column({ length: 80 })
  password: string;

  @Column({ length: 80, unique: true })
  telefono: string;

   @Column({
    type: 'enum',
    enum: Rol,
    default: Rol.SERVIDOR, // opcional
  })
  rol: Rol;

  @OneToMany(() => Aseo, (aseo) => aseo.miembro)
  aseos: Aseo[];

  @ManyToMany(() => CasasDeFe, (casasDeFe) => casasDeFe.encargadosId)
  casasDeFe: CasasDeFe[];
}
