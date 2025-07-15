import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AseosService } from 'src/aseos/aseos.service';
import { MiembrosService } from 'src/miembros/miembros.service';
import * as dayjs from 'dayjs';
import { Miembro } from 'src/miembros/entities/miembro.entity';
import { AseoGateway } from './aseo.gateway';
import { Horario } from 'src/miembros/enum/horario.enum';

@Injectable()
export class AseoCronService {
  private readonly logger = new Logger(AseoCronService.name);

  constructor(
    private readonly miembroService: MiembrosService,
    private readonly aseoService: AseosService,
    private readonly aseoGateway: AseoGateway,
  ) {}

  //@Cron('0 0 0 1 * *')
  async generarHorarioMensualDeAseo() {
    this.logger.log('🧹 Generando horario de aseo mensual...');

    const miembros = await this.miembroService.findAllMembers();
    const fechas = this.obtenerDiasJuevesYDomingoDelProximoMes();
    const domingos = fechas.filter((f) => dayjs(f).day() === 0);
    const jueves = fechas.filter((f) => dayjs(f).day() === 4);

    const miembrosUsados = new Set<number>();
    const asignaciones: { miembro: Miembro; fecha: Date }[] = [];
    const asignacionesPorFecha: Record<string, Miembro[]> = {};
    const asignacionesPorMiembro: Record<number, number> = {};
    const resumenDiasIncompletos: string[] = [];

    const asignar = (miembro: Miembro, fecha: Date) => {
      const key = fecha.toISOString();
      if (!asignacionesPorFecha[key]) asignacionesPorFecha[key] = [];
      asignaciones.push({ miembro, fecha });
      asignacionesPorFecha[key].push(miembro);
      miembrosUsados.add(miembro.id);
      asignacionesPorMiembro[miembro.id] = (asignacionesPorMiembro[miembro.id] || 0) + 1;
    };

    const todosLosDias = [...domingos, ...jueves];

    // Paso 1: Asignar 1 por día según disponibilidad
    for (const fecha of todosLosDias) {
      const dia = dayjs(fecha).day();
      const compatibles = this.mezclarArray(
        miembros.filter((m) => {
          const asignacionesTotales = asignacionesPorMiembro[m.id] || 0;
          if (asignacionesTotales >= 2) return false;
          if (
            dia === 0 &&
            (m.horario_aseo === Horario.DOMINGO || m.horario_aseo === Horario.ANY)
          ) return true;
          if (
            dia === 4 &&
            (m.horario_aseo === Horario.JUEVES || m.horario_aseo === Horario.ANY)
          ) return true;
          return false;
        })
      );

      if (compatibles.length > 0) asignar(compatibles[0], fecha);
    }

    // Paso 2: Completar los días con el mínimo requerido
    for (const fecha of todosLosDias) {
      const key = fecha.toISOString();
      const dia = dayjs(fecha).day();
      const minimo = dia === 0 ? 3 : 2;
      const asignados = asignacionesPorFecha[key]?.length || 0;
      if (asignados >= minimo) continue;

      let faltan = minimo - asignados;

      const compatibles = this.mezclarArray(
        miembros.filter((m) => {
          const asignacionesTotales = asignacionesPorMiembro[m.id] || 0;
          if (asignacionesTotales >= 2) return false;
          if (
            dia === 0 &&
            (m.horario_aseo === Horario.DOMINGO || m.horario_aseo === Horario.ANY)
          ) return true;
          if (
            dia === 4 &&
            (m.horario_aseo === Horario.JUEVES || m.horario_aseo === Horario.ANY)
          ) return true;
          return false;
        })
      );

      for (const miembro of compatibles) {
        if (faltan <= 0) break;
        asignar(miembro, fecha);
        faltan--;
      }

      const finalCount = asignacionesPorFecha[key]?.length || 0;
      if (finalCount < minimo) {
        resumenDiasIncompletos.push(
          `❌ El ${dayjs(fecha).format('dddd DD/MM/YYYY')} no pudo ser completado. Solo ${finalCount}/${minimo} asignados.`,
        );
      }
    }

    // Paso 3: Guardar asignaciones
    let miembrosAsignados = 0;
    for (const { miembro, fecha } of asignaciones) {
      const yaExiste = await this.aseoService.existeAsignacionEnFecha(
        miembro.id,
        fecha,
      );
      if (yaExiste) {
        this.logger.warn(
          `🚫 Ya existe asignación para ${miembro.name} ${miembro.apellido} el ${dayjs(fecha).format('DD/MM/YYYY')}`,
        );
        continue;
      }

      await this.aseoService.create({
        miembroId: miembro.id,
        fecha: fecha.toISOString(),
      });

      this.logger.log(
        `✅ Asignado ${miembro.name} para el ${dayjs(fecha).format('DD/MM/YYYY')}`,
      );
      miembrosAsignados++;
    }

    this.logger.log(`✅ Se generaron ${miembrosAsignados} asignaciones de aseo.`);

    if (resumenDiasIncompletos.length > 0) {
      this.logger.warn('⚠️ Días con asignaciones incompletas:');
      resumenDiasIncompletos.forEach((msg) => this.logger.warn(msg));
    }

    this.aseoGateway.notificarNuevoHorario();
  }

  obtenerDiasJuevesYDomingoDelProximoMes(): Date[] {
    const fechas: Date[] = [];
    const inicio = dayjs().add(1, 'month').startOf('month');
    const fin = dayjs().add(1, 'month').endOf('month');

    for (let fecha = inicio; fecha.isBefore(fin); fecha = fecha.add(1, 'day')) {
      const dia = fecha.day(); // 0 = domingo, 4 = jueves
      if (dia === 0 || dia === 4) {
        fechas.push(fecha.toDate());
      }
    }

    return fechas;
  }

  mezclarArray<T>(array: T[]): T[] {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
}
