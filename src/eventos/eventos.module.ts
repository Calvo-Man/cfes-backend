import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento]),
  ],
  controllers: [EventosController],
  providers: [EventosService,JwtService],
  exports: [EventosService],
})
export class EventosModule {}
