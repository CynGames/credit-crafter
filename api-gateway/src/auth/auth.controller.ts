import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import admin, { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() registerDto: RegisterUserDto): Promise<any> {
    const { data } = await this.authService.login(registerDto);
    return data;
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterUserDto): Promise<any> {
    return await this.authService.register(registerDto);
  }

  @Get('/listUsers')
  async getAccounts(): Promise<UserRecord[]> {
    const { users } = await admin.auth().listUsers(1000);
    return users;
  }
}

// export type RegisterUserDto = {
//   email: string;
//   displayName: string;
//   password: string;
// };
