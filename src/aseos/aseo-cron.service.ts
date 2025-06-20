// aseo-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Aseo } from 'src/aseos/entities/aseo.entity';
import { AseosService } from 'src/aseos/aseos.service';
import { MiembrosService } from 'src/miembros/miembros.service';
import * as dayjs from 'dayjs';
import { Miembro } from 'src/miembros/entities/miembro.entity';

@Injectable()
export class AseoCronService {
  private readonly logger = new Logger(AseoCronService.name);

  constructor(
    private readonly miembroService: MiembrosService,
    private readonly aseoService: AseosService,
  ) {}
  // @Cron('0 0 25 * *')
  @Cron('* * * * *') // ✅ Ejecuta cada minuto
  async generarHorarioMensualDeAseo() {
    this.logger.log(
      '🧹 Generando horario de aseo mensual aleatorio con al menos un miembro por día...',
    );
    let miembrosAsignados = 0;
    const miembros = await this.miembroService.findAll();
    const fechas = this.obtenerDiasJuevesYDomingoDelProximoMes();

    if (miembros.length < fechas.length) {
      this.logger.warn(
        `🚫 No hay suficientes miembros para cubrir todos los días (${miembros.length}/${fechas.length})`,
      );
      return;
    }

    const miembrosAleatorios = this.mezclarArray(miembros);
    const usadosEsteMes = new Set<number>();
    const asignaciones: { miembro: Miembro; fecha: Date }[] = [];

    // Paso 1: asignar al menos 1 por día
    for (let i = 0; i < fechas.length; i++) {
      const miembro = miembrosAleatorios[i];
      const fecha = fechas[i];

      asignaciones.push({ miembro, fecha });
      usadosEsteMes.add(miembro.id);
    }

    // Paso 2: asignar más miembros aleatoriamente si sobran
    const miembrosRestantes = miembrosAleatorios.filter(
      (m) => !usadosEsteMes.has(m.id),
    );
    const fechasAleatorias = this.mezclarArray(fechas);

    let fechaExtraIndex = 0;
    for (const miembro of miembrosRestantes) {
      const fecha = fechasAleatorias[fechaExtraIndex % fechasAleatorias.length];
      asignaciones.push({ miembro, fecha });
      usadosEsteMes.add(miembro.id);
      fechaExtraIndex++;
    }

    // Paso 3: guardar en la base de datos si no existen duplicados
    for (const asignacion of asignaciones) {
      const { miembro, fecha } = asignacion;

      const yaExiste = await this.aseoService.existeAsignacionEnMes(
        miembro.id,
        fecha,
      );

      if (yaExiste) {
        this.logger.warn(
          `🚫 Ya existe una asignación de aseo para ${miembro.name} ${miembro.apellido} el ${dayjs(fecha).format('DD/MM/YYYY')}.`,
        );
        continue;
      }
      miembrosAsignados++;
      await this.aseoService.create({
        miembroId: miembro.id,
        fecha: fecha.toISOString(),
      });

      this.logger.log(
        `✅ Asignado ${miembro.name} para el ${dayjs(fecha).format('DD/MM/YYYY')}`,
      );
    }
    this.logger.log(
      `✅ Se generaron ${miembrosAsignados} asignaciones de aseo para el próximo mes.`,
    );

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
