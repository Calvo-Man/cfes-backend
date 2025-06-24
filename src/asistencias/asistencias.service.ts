// asistencias.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
      throw new Error('Asistencia no encontrada');
    }
    asistencia.mensaje_enviado = true;
    return await this.asistenciaRepository.save(asistencia);
  }

  // Los demás métodos pueden quedarse igual por ahora
}
