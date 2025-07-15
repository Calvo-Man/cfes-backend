import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MiembrosService } from 'src/miembros/miembros.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
   constructor(
    private jwtService: JwtService,
    private readonly miembroService: MiembrosService
   ) {}
   async login(auth: AuthDto) {
    const user = await this.validateUser(auth);
    //const payload = { user: user.user, sub: user.id, rol: user.rol };
    return {
      access_token: this.jwtService.sign(user),
      user
    };
  }
  async validateUser(auth:AuthDto): Promise<any> {
    const user = await this.miembroService.findOneByUser(auth.user);
    if (user && await bcrypt.compare(auth.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }
}
