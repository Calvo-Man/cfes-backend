import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateEventoDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Date) // ✅ convierte el string en Date
  @IsDate()         // ✅ valida que sea una fecha válida
  date: Date;
}
