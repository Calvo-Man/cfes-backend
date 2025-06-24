// src/whatsapp/whatsapp.service.ts
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class WhatsappService {
  private client: Twilio;
  private readonly from = 'whatsapp:+14155238886'; // Número oficial de Twilio para sandbox

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async enviarMensaje(to: string, mensaje: string) {
    await this.client.messages.create({
      body: mensaje,
      from: this.from,
      to: `whatsapp:+57${to}`,
    });
  }

 async enviarArchivoPorWhatsApp(mediaUrl: string, to: string ) {
  await this.client.messages.create({
    from: this.from,
    to: `whatsapp:+57${to}`,
    body: '📄 Aquí tienes el calendario de aseo en PDF',
    mediaUrl: [mediaUrl], // Array de URLs públicas
  });
}

}
