import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMiembroDto } from './dto/create-miembro.dto';
import { UpdateMiembroDto } from './dto/update-miembro.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Miembro } from './entities/miembro.entity';
import * as bcrypt from 'bcrypt';
import { Rol } from 'src/roles/enum/roles.enum';
import { Horario } from './enum/horario.enum';
@Injectable()
export class MiembrosService {
  constructor(
    @InjectRepository(Miembro) private miembroRepository: Repository<Miembro>,
  ) {}
  async create(createMiembroDto: CreateMiembroDto) {
    const findMiembro = await this.miembroRepository.findOne({
      where: {
        user: createMiembroDto.user,
        telefono: createMiembroDto.telefono,
      },
    });
    if (findMiembro) {
      throw new BadRequestException('Miembro ya registrado');
    }
    const hashedPassword = await bcrypt.hash(createMiembroDto.password, 10);
    const nuevoMiembro = this.miembroRepository.create({
      name: createMiembroDto.name,
      apellido: createMiembroDto.apellido,
      user: createMiembroDto.user,
      password: hashedPassword,
      telefono: createMiembroDto.telefono,
      rol: createMiembroDto.rol,
      horario_aseo: createMiembroDto.horario_aseo
    });
    const savedMiembro = await this.miembroRepository.save(nuevoMiembro);
    return{
      id: savedMiembro.id,
      name: savedMiembro.name,
      apellido: savedMiembro.apellido,
      telefono: savedMiembro.telefono,
      rol: savedMiembro.rol
    };
  }
  async poblarMiembrosDePrueba(cantidad: number) {
  const horarios = [Horario.DOMINGO, Horario.JUEVES, Horario.ANY];
  
  console.log(cantidad);
  for (let i = 1; i <= cantidad; i++) {
    await this.create({
      name: `Miembro${i}`,
      apellido: `Prueba`,
      telefono: `30012345${i.toString().padStart(2, '0')}`,
      user: `user${i.toString().padStart(2, '0')}`,
      password: `password${i.toString().padStart(2, '0')}`,
      rol: Rol.SERVIDOR,
      horario_aseo: horarios[Math.floor(Math.random() * horarios.length)],
    });
  }

  return { mensaje: `${cantidad} miembros creados con horario aleatorio.` };
}

async eliminarTodosLosMiembros() {
  await this.miembroRepository.clear();
  return { mensaje: '🗑️ Todos los miembros fueron eliminados correctamente.' };
}

  async findAll() {
    const miembros = await this.miembroRepository.find();
    if (!miembros) {
      throw new BadRequestException('Miembros no encontrados');
    }
    return {
      miembros: miembros.map((miembro) => ({
        id: miembro.id,
        name: miembro.name,
        apellido: miembro.apellido,
        telefono: miembro.telefono,
        rol: miembro.rol,
        disponibilidad_aseo: miembro.disponibilidad_aseo,
        horario_aseo: miembro.horario_aseo,
      })),
    };
  }
  async findAllMembers() {
    const miembros = await this.miembroRepository.find();
    if (!miembros) {
      throw new BadRequestException('Miembros no encontrados');
    }
    return miembros;
  } 

  async getMiembros() {
    const miembros = await this.miembroRepository.find();
    if (!miembros) {
      throw new BadRequestException('Miembros no encontrados');
    }
    return {
      miembros: miembros.map((miembro) => ({
        id: miembro.id,
        name: miembro.name,
        apellido: miembro.apellido,
        telefono: miembro.telefono,
        rol: miembro.rol,
        disponibilidad_aseo: miembro.disponibilidad_aseo,
        horario_aseo: miembro.horario_aseo,
      })),
    };
  }

  async findOne(id: number) {
    const miembro = await this.miembroRepository.findOne({ where: { id } });
    if (!miembro) {
      throw new BadRequestException('Miembro no encontrado');
    }
    return {
      id: miembro.id,
      name: miembro.name,
      apellido: miembro.apellido,
      telefono: miembro.telefono,
      rol: miembro.rol,
      disponibilidad_aseo: miembro.disponibilidad_aseo,
      horario_aseo: miembro.horario_aseo,
    };
  }

  async countMiembros() {
    const count = await this.miembroRepository.count();
    return count;
  }
  async findOneByUser(user: string) {
    const miembro = await this.miembroRepository.findOne({ where: { user } });
    if (!miembro) {
      throw new BadRequestException('Miembro no encontrado');
    }
    return miembro;
  }
  async update(id: number, updateMiembroDto: UpdateMiembroDto) {
    const findMiembro = await this.miembroRepository.findOne({ where: { id } });
    if (!findMiembro) {
      throw new BadRequestException('Miembro no encontrado');
    }
    try {
      await this.miembroRepository.update(id, updateMiembroDto);
      return {
        message: 'Miembro actualizado con exito',
        status: 200,
      };
    } catch (error) {
      throw new BadRequestException(
        'Error al actualizar miembro',
        error.message,
      );
    }
  }

  async remove(id: number) {
    const findMiembro = await this.miembroRepository.findOne({ where: { id } });
    if (!findMiembro) {
      throw new BadRequestException('Miembro no encontrado');
    }
    try {
      await this.miembroRepository.delete(id);
      return {
        message: 'Miembro eliminado con exito',
        status: 200,
      };
    } catch (error) {
      throw new BadRequestException('Error al eliminar miembro', error.message);
    }
  }
}
