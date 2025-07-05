import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MiembrosService } from './miembros.service';
import { CreateMiembroDto } from './dto/create-miembro.dto';
import { UpdateMiembroDto } from './dto/update-miembro.dto';

@Controller('miembros')
export class MiembrosController {
  constructor(private readonly miembrosService: MiembrosService) {}

  @Post('create')
  create(@Body() createMiembroDto: CreateMiembroDto) {
    return this.miembrosService.create(createMiembroDto);
  }

  @Get()
  findAll() {
    return this.miembrosService.getMiembros();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.miembrosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMiembroDto: UpdateMiembroDto) {
    return this.miembrosService.update(+id, updateMiembroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.miembrosService.remove(+id);
  }
}
