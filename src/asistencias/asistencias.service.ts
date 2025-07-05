// asistencias.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import * as moment from 'moment-timezone';
import { Asistencia } from './entities/asistencia.entity';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepository: Repository<Asistencia>,
  ) {}

  async create(createAsistenciaDto: CreateAsistenciaDto): Promise<Asistencia> {
    const fechaColombia = moment().tz('America/Bogota').toDate();

    const nuevaAsistencia =  this.asistenciaRepository.create({
      ...createAsistenciaDto,
      fecha: fechaColombia,
    });

    return await this.asistenciaRepository.save(nuevaAsistencia);
  }
  async MensajeEnviado(id: number) {
    const asistencia = await this.asistenciaRepository.findOne({ where: { id } });
    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }
    asistencia.mensaje_enviado = true;
    return await this.asistenciaRepository.save(asistencia);
  }

 async findAll() {
    const asistencias = await this.asistenciaRepository.find();
    if (!asistencias) {
      throw new NotFoundException('Asistencias no encontradas');
    }
    return asistencias;
  }

  async findOneById(id: number) {
    const asistencia = await this.asistenciaRepository.findOne({ where: { id } });
    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }
    return asistencia;
  }

  async update(id: number, updateAsistenciaDto: CreateAsistenciaDto) {
    const asistencia = await this.asistenciaRepository.findOne({ where: { id } });
    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }
    return await this.asistenciaRepository.update(id, updateAsistenciaDto);
  }

  async remove(id: number) {
    const asistencia = await this.asistenciaRepository.delete(id);
    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }
    return asistencia;
  }
}
