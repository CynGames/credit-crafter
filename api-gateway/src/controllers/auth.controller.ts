import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { AuthService } from '../auth/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterUserDto): Promise<any> {
    return this.authService.registerUser(registerDto);
  }
}
