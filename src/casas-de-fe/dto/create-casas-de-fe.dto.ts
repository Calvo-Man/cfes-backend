import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateCasasDeFeDto {
  @IsString()
  nombre: string;

  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;

  @IsArray()
  @IsNumber({}, { each: true })
  encargadosId: number[];
}
