import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAseoDto } from './dto/create-aseo.dto';
import { UpdateAseoDto } from './dto/update-aseo.dto';
import { Aseo } from './entities/aseo.entity';
import { Between, Repository } from 'typeorm';
import { Miembro } from 'src/miembros/entities/miembro.entity';
import * as dayjs from 'dayjs'; // ✅ Así funciona siempre con TypeScript y CommonJS
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AseosService {
  constructor(
    @InjectRepository(Aseo)
    private readonly aseoRepository: Repository<Aseo>,
    @InjectRepository(Miembro)
    private readonly miembroRepository: Repository<Miembro>,
  ) {}
  async create(createAseoDto: CreateAseoDto) {
    const miembro = await this.miembroRepository.findOne({
      where: { id: createAseoDto.miembroId }, // ✅ OK: se espera un objeto
    });

    if (!miembro) {
      throw new NotFoundException('Miembro no encontrado');
    }

    const fecha = new Date(createAseoDto.fecha);
    if (isNaN(fecha.getTime())) {
      throw new BadRequestException('Fecha inválida');
    }

    const aseo = this.aseoRepository.create({
      miembro,
      fecha: new Date(createAseoDto.fecha),
    });

    return await this.aseoRepository.save(aseo);
  }

  async existeAsignacionEnMes(
    miembroId: number,
    fecha: Date,
  ): Promise<boolean> {
    const inicioMes = dayjs(fecha).startOf('month').toDate();
    const finMes = dayjs(fecha).endOf('month').toDate();

    const existe = await this.aseoRepository.findOne({
      where: {
        miembro: { id: miembroId },
        fecha: Between(inicioMes, finMes),
      },
      relations: ['miembro'],
    });

    return !!existe;
  }

  findAll() {
    return `This action returns all aseos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aseo`;
  }

  update(id: number, updateAseoDto: UpdateAseoDto) {
    return `This action updates a #${id} aseo`;
  }

  remove(id: number) {
    return `This action removes a #${id} aseo`;
  }
}
