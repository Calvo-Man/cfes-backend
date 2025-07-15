import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Rol } from 'src/roles/enum/roles.enum';
import { Horario } from '../enum/horario.enum';

export class CreateMiembroDto {
  @IsString()
  name: string;

  @IsString()
  apellido: string;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsString()
  telefono: string;
  
  @IsEnum(Rol)
  rol: Rol;

  @IsEnum(Horario)
  @IsOptional()
  horario_aseo: Horario;
}
