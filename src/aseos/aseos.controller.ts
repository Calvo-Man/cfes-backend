import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AseosService } from './aseos.service';
import { CreateAseoDto } from './dto/create-aseo.dto';
import { UpdateAseoDto } from './dto/update-aseo.dto';

@Controller('aseos')
export class AseosController {
  constructor(private readonly aseosService: AseosService) {}

  @Post()
  create(@Body() createAseoDto: CreateAseoDto) {
    return this.aseosService.create(createAseoDto);
  }

  @Get()
  findAll() {
    return this.aseosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aseosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAseoDto: UpdateAseoDto) {
    return this.aseosService.update(+id, updateAseoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aseosService.remove(+id);
  }
}
