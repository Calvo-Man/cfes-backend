import { Aseo } from 'src/aseos/entities/aseo.entity';
import { Rol } from 'src/roles/enum/roles.enum';
import {
  Column,
  Entity,
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
    default: Rol.LIDER, // opcional
  })
  rol: Rol;

  @OneToMany(() => Aseo, (aseo) => aseo.miembro)
  aseos: Aseo[];
}
