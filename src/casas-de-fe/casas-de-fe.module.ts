import { Module } from '@nestjs/common';
import { CasasDeFeService } from './casas-de-fe.service';
import { CasasDeFeController } from './casas-de-fe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasasDeFe } from './entities/casas-de-fe.entity';
import { GeocodingService } from 'src/geolocalizacion/geocoding.service';
import { NominatimService } from 'src/geolocalizacion/nominatim.service';
import { OpenRouteService } from 'src/geolocalizacion/openroute.service';
import { OpenCageService } from 'src/geolocalizacion/opencage.service';
import { Miembro } from 'src/miembros/entities/miembro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CasasDeFe, Miembro]),
  ],
  controllers: [CasasDeFeController],
  providers: [CasasDeFeService, GeocodingService,NominatimService,OpenRouteService,OpenCageService],
  exports: [CasasDeFeService],
})
export class CasasDeFeModule {}
