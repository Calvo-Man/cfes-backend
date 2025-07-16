import { Module } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './entities/asistencia.entity';
import { AsistenciasNotificacionService } from './asistencias-notificacion.service';
import { CasasDeFe } from 'src/casas-de-fe/entities/casas-de-fe.entity';
import { NominatimService } from 'src/geolocalizacion/nominatim.service';
import { OpenRouteService } from 'src/geolocalizacion/openroute.service';
import { OpenCageService } from 'src/geolocalizacion/opencage.service';
import { WhatsappService } from 'src/whastsapp/whatsapp.service';
import { GeocodingService } from 'src/geolocalizacion/geocoding.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asistencia, CasasDeFe]),
  ],
  controllers: [AsistenciasController],
  providers: [AsistenciasService,GeocodingService, AsistenciasNotificacionService,NominatimService,OpenRouteService,WhatsappService,JwtService],
})
export class AsistenciasModule {}
