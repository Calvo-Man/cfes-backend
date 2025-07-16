import { Module } from '@nestjs/common';
import { MiembrosService } from './miembros.service';
import { MiembrosController } from './miembros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Miembro } from './entities/miembro.entity';
import { JwtService } from '@nestjs/jwt';
import { Aseo } from 'src/aseos/entities/aseo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Miembro,Aseo]),
  ],
  controllers: [MiembrosController],
  providers: [MiembrosService,JwtService],
  exports: [MiembrosService],
})
export class MiembrosModule {}
