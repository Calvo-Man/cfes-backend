import { Module } from '@nestjs/common';
import { MiembroCasaDeFeService } from './miembro-casa-de-fe.service';
import { MiembroCasaDeFeController } from './miembro-casa-de-fe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasasDeFe } from 'src/casas-de-fe/entities/casas-de-fe.entity';
import { MiembroCasaDeFe } from './entities/miembro-casa-de-fe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MiembroCasaDeFe, CasasDeFe]),
  ],
  controllers: [MiembroCasaDeFeController],
  providers: [MiembroCasaDeFeService],
})
export class MiembroCasaDeFeModule {}
