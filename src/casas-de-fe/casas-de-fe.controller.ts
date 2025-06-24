import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CasasDeFeService } from './casas-de-fe.service';
import { CreateCasasDeFeDto } from './dto/create-casas-de-fe.dto';
import { UpdateCasasDeFeDto } from './dto/update-casas-de-fe.dto';

@Controller('casas-de-fe')
export class CasasDeFeController {
  constructor(private readonly casasDeFeService: CasasDeFeService) {}

  @Post()
  create(@Body() createCasasDeFeDto: CreateCasasDeFeDto) {
    return this.casasDeFeService.create(createCasasDeFeDto);
  }
  @Get('cercano')
  async puntoMasCercano(@Query('lat') lat: string, @Query('lon') lon: string) {
    return this.casasDeFeService.obtenerPuntoMasCercano(
      parseFloat(lat),
      parseFloat(lon),
    );
  }
  // puntos.controller.ts
  @Get('buscar-cercano')
  async buscarDesdeBarrio(@Query('barrio') barrio: string) {
    return this.casasDeFeService.buscarPuntoMasCercanoDesdeBarrio(barrio);
  }
  @Get('buscar-casa-cercano')
  async buscarCasaCercano(@Query('barrio') barrio: string) {
    return this.casasDeFeService.puntoMasCercanoDesde(barrio);
  }
}
