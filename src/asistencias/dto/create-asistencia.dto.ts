import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAsistenciaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsString()
  @IsNotEmpty()
  apellido: string;
  @IsString()
  @IsNotEmpty()
  telefono: string;
  @IsString()
  @IsNotEmpty()
  direccion: string;
  @IsString()
  @IsNotEmpty()
  barrio: string;
}
