import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dtos/register-user-dto';
import { LoginUserDTO } from './dtos/login-user.dto';
import { Response } from 'express';
import admin, { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;
import { CreateUserDTO } from '../shared-definitions/types-dto-constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() loginDTO: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { token } = await this.authService.login(loginDTO);
    res.cookie('token', token, { httpOnly: true });

    return { message: 'Login successful' };
  }

  @Post('/register')
  async register(@Body() registerDTO: RegisterUserDTO): Promise<CreateUserDTO> {
    return await this.authService.register(registerDTO);
  }

  @Get('/listUsers')
  async getAccounts(): Promise<UserRecord[]> {
    const { users } = await admin.auth().listUsers(1000);
    return users;
  }
}
