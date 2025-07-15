import { Module } from '@nestjs/common';
import { MiembrosService } from './miembros.service';
import { MiembrosController } from './miembros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Miembro } from './entities/miembro.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Miembro]),
  ],
  controllers: [MiembrosController],
  providers: [MiembrosService,JwtService],
  exports: [MiembrosService],
})
export class MiembrosModule {}
