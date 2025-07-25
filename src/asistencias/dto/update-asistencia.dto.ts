import { PartialType } from '@nestjs/mapped-types';
import { CreateAsistenciaDto } from './create-asistencia.dto';

export class UpdateAsistenciaDto extends PartialType(CreateAsistenciaDto) {
   nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    barrio: string; 

}
