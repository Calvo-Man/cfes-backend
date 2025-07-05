import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Evento } from './entities/evento.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventosRepository: Repository<Evento>) {}
  async create(createEventoDto: CreateEventoDto) {
    const findEvento = await this.eventosRepository.findOneBy({
      name: createEventoDto.name,
    });
    if (findEvento) {
      throw new ConflictException('El evento ya existe');
    }
    const evento = this.eventosRepository.create(createEventoDto);
    return await this.eventosRepository.save(evento);
  }

  async findAll() {
    const eventos = await this.eventosRepository.find();
    if (!eventos) {
      throw new NotFoundException('Eventos no encontrados');
    }
    return eventos;
  }
  async findAllAgrupadoPorMes() {
  const eventos = await this.eventosRepository.find();

  if (!eventos || eventos.length === 0) {
    throw new NotFoundException('Eventos no encontrados');
  }

  const agrupados = eventos.reduce((acc, evento) => {
    const fecha = new Date(evento.date);
    const claveMes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

    if (!acc[claveMes]) {
      acc[claveMes] = [];
    }

    acc[claveMes].push(evento);
    return acc;
  }, {});

  return agrupados;
}


  async findOne(id: number) {
    const evento = await this.eventosRepository.findOneBy({ id });
    if (!evento) {
      throw new NotFoundException('Evento no encontrado');
    }
    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    const evento = await this.eventosRepository.findOneBy({ id });
    if (!evento) {
      throw new NotFoundException('Evento no encontrado');
    }
    return await this.eventosRepository.update(id, updateEventoDto);
  }

  async remove(id: number) {
    const evento = await this.eventosRepository.findOneBy({ id });
    if (!evento) {
      throw new NotFoundException('Evento no encontrado');
    }
    return await this.eventosRepository.remove(evento);
  }
}
