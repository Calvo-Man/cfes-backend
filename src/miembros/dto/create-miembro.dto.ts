import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Rol } from 'src/roles/enum/roles.enum';

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
}
