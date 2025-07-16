// src/asistencias/asistencias-notificacion.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { CasasDeFe } from '../casas-de-fe/entities/casas-de-fe.entity';

import { Asistencia } from './entities/asistencia.entity';
import { NominatimService } from 'src/geolocalizacion/nominatim.service';
import { OpenRouteService } from 'src/geolocalizacion/openroute.service';
import { WhatsappService } from 'src/whastsapp/whatsapp.service';
import { Cron } from '@nestjs/schedule';
import { AsistenciasService } from './asistencias.service';
import { GeocodingService } from 'src/geolocalizacion/geocoding.service';

@Injectable()
export class AsistenciasNotificacionService {
  private readonly logger = new Logger(AsistenciasNotificacionService.name);

  constructor(
    @InjectRepository(Asistencia)
    private readonly usuarioRepository: Repository<Asistencia>,
    @InjectRepository(CasasDeFe)
    private readonly casasDeFeRepository: Repository<CasasDeFe>,
    private readonly asistenciasService: AsistenciasService,
    private readonly nominatimService: NominatimService,
    private readonly openRouteService: OpenRouteService,
    private readonly whatsappService: WhatsappService,
    private readonly geocodingService: GeocodingService,
  ) {}
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  @Cron('* * * * *')
  async notificarEncargadosConUsuariosCercanos() {
    this.logger.debug('Notificando encargados con usuarios cercanos');
    const usuarios = await this.usuarioRepository.find({
      where: { direccion: Not(IsNull()), mensaje_enviado: false },
    });
    this.logger.debug(`Encontrados ${usuarios.length} usuarios`);
    const casas = await this.casasDeFeRepository.find({
      relations: ['encargadosId'],
    });
    if (usuarios.length === 0 || casas.length === 0) {
      return;
    }
    this.logger.debug(`Encontradas ${casas.length} casas`);
    const mapaUsuariosPorCasa: Record<number, Asistencia[]> = {};
    this.logger.debug('Procesando usuarios...');
    for (const usuario of usuarios) {
      try {
        await this.sleep(1000);
        this.logger.debug(`Procesando ${usuario.nombre}`);
        await this.asistenciasService.MensajeEnviado(usuario.id);
        this.logger.debug('Mensaje enviado', usuario.mensaje_enviado);
        const coords = await this.geocodingService.obtenerCoordenadas(
          usuario.direccion,
        );
        this.logger.debug('Coordenadas obtenidas', coords);
        let casaMasCercana: CasasDeFe | null = null;
        let menorDistancia = Infinity;

        for (const casa of casas) {
          const distancia = await this.openRouteService.calcularRuta(
            [coords.longitud, coords.latitud],
            [casa.longitud, casa.latitud],
          );

          if (distancia < menorDistancia) {
            menorDistancia = distancia;
            casaMasCercana = casa;
          }
          this.logger.debug(`Distancia a ${casa.nombre}: ${distancia}`);
        }

        if (casaMasCercana) {
          mapaUsuariosPorCasa[casaMasCercana.id] ||= [];
          mapaUsuariosPorCasa[casaMasCercana.id].push(usuario);
          await this.asistenciasService.asignarCasaDeFe(
            usuario.id,
            casaMasCercana,
          );
        }
        this.logger.debug('Usuarios por casa', mapaUsuariosPorCasa);
      } catch (err) {
        this.logger.warn(
          `❌ Fallo al procesar ${usuario.nombre}: ${err.message}`,
        );
      }
    }

    for (const [casaId, usuariosCercanos] of Object.entries(
      mapaUsuariosPorCasa,
    )) {
      const casa = casas.find((c) => c.id === +casaId);
      if (!casa) continue;

//       const mensaje =
//         `📍 Usuarios cercanos a ${casa.nombre}:

// ` + usuariosCercanos.map((u) => `• ${u.nombre} (${u.telefono})`).join('\n');

      for (const encargado of casa.encargadosId) {
        try {
          const telefono = encargado.telefono.startsWith('57')
            ? encargado.telefono
            : `57${encargado.telefono}`;

          const listaUsuarios = usuariosCercanos
            .map((u) => `${u.nombre} - ${u.telefono}`)
            .join('\n');

          const respuesta =
            await this.whatsappService.enviarMensajePlantillaConVariables(
              telefono,
              'asistencias_cercanas',
              [casa.nombre, listaUsuarios],
            );

          this.logger.debug(
            `✅ Mensaje enviado a ${encargado.name}: ${JSON.stringify(respuesta)}`,
          );
        } catch (err) {
          this.logger.warn(
            `❌ Error al enviar mensaje a ${encargado.name}: ${err.message}`,
          );
        }
      }
    }
  }
}
