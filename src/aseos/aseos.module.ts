import { Module } from '@nestjs/common';
import { AseosService } from './aseos.service';
import { AseosController } from './aseos.controller';
import { AseoCronService } from './aseo-cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aseo } from './entities/aseo.entity';
import { Miembro } from 'src/miembros/entities/miembro.entity';
import { MiembrosService } from 'src/miembros/miembros.service';

@Module({
   imports: [
    TypeOrmModule.forFeature([Aseo, Miembro]), // 👈 ¡Importante!
  ],
  controllers: [AseosController],
  providers: [AseosService, AseoCronService,MiembrosService],
  exports: [AseosService,],
})
export class AseosModule {}
