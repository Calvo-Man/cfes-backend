// pdf.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { Request } from 'express';
import { WhatsappService } from './whatsapp.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('enviar')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: diskStorage({
        destination: './uploads/pdf',
        filename: (req, file, cb) => {
          const nombre = `${uuid()}${path.extname(file.originalname)}`;
          cb(null, nombre);
        },
      }),
    }),
  )
  async recibirPdf(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    // Obtener protocolo y host dinámicamente
    const protocolo = req.protocol;
    const host = req.get('host'); // incluye puerto si aplica

    const url = `${protocolo}://${host}/uploads/pdf/${file.filename}`;
    console.log('📎 URL del PDF:', url);
    const to = '3024064896';
    await this.whatsappService.enviarArchivoPorWhatsApp(url, to);
    return { ok: true, enviado: file.originalname, url };
  }
}
