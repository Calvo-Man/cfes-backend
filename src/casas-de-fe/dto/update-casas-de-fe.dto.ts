import { PartialType } from '@nestjs/mapped-types';
import { CreateCasasDeFeDto } from './create-casas-de-fe.dto';

export class UpdateCasasDeFeDto extends PartialType(CreateCasasDeFeDto) {}
