import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerDto: RegisterUserDto): Promise<any> {
    try {
      await this.authService.registerUser(registerDto);
      return {};
    } catch (error) {
      return { error: error };
    }
  }
}
