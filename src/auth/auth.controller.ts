import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() authDto:AuthDto) {
    return this.authService.login(authDto);
  }

  @Patch('change-password')
  changePassword(@Body() authDto:AuthDto) {
    return this.authService.changePassword(authDto);
  }
}
