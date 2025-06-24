import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMiembroDto } from './dto/create-miembro.dto';
import { UpdateMiembroDto } from './dto/update-miembro.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Miembro } from './entities/miembro.entity';

@Injectable()
export class MiembrosService {
  constructor(
    @InjectRepository(Miembro) private miembroRepository: Repository<Miembro>,
  ) {}
 async create(createMiembroDto: CreateMiembroDto) {
    const findMiembro =await this.miembroRepository.findOne({
      where: {
        user: createMiembroDto.user,
        telefono: createMiembroDto.telefono
      },
    });
    if (findMiembro) {
       throw new BadRequestException('Miembro ya registrado');
    }
    const nuevoMiembro = this.miembroRepository.create({
    name: createMiembroDto.name,
    apellido: createMiembroDto.apellido,
    user: createMiembroDto.user,
    password: createMiembroDto.password,
    telefono: createMiembroDto.telefono,
    rol: createMiembroDto.rol,
    
  });
    return await this.miembroRepository.save(nuevoMiembro);
  }

  async findAll() {
    return await this.miembroRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} miembro`;
  }

  update(id: number, updateMiembroDto: UpdateMiembroDto) {
    return `This action updates a #${id} miembro`;
  }

  remove(id: number) {
    return `This action removes a #${id} miembro`;
  }
}
