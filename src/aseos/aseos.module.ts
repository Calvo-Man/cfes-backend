import { Module } from '@nestjs/common';
import { AseosService } from './aseos.service';
import { AseosController } from './aseos.controller';
import { AseoCronService } from './aseo-cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aseo } from './entities/aseo.entity';
import { Miembro } from 'src/miembros/entities/miembro.entity';
import { MiembrosService } from 'src/miembros/miembros.service';
import { AseoGateway } from './aseo.gateway';
import { WhatsappService } from 'src/whastsapp/whatsapp.service';
import { PdfController } from 'src/whastsapp/pdf.controller';

@Module({
   imports: [
    TypeOrmModule.forFeature([Aseo, Miembro]), // 👈 ¡Importante!
  ],
  controllers: [AseosController],
  providers: [AseosService, AseoCronService,MiembrosService,AseoGateway,WhatsappService,PdfController],
  exports: [AseosService],
})
export class AseosModule {}
