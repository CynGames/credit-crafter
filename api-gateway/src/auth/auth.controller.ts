import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dtos/register-user-d-t.o';
import { LoginUserDTO } from './dtos/login-user.dto';
import { UserCreatePayload } from '../shared-definitions/types-dto-constants';
import { Response } from 'express';
import admin, { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() loginDTO: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const { token } = await this.authService.login(loginDTO);
      res.cookie('token', token, { httpOnly: true });

      return { message: 'Login successful' };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('/register')
  async register(
    @Body() registerDTO: RegisterUserDTO,
  ): Promise<UserCreatePayload> {
    return await this.authService.register(registerDTO);
  }

  @Get('/listUsers')
  async getAccounts(): Promise<UserRecord[]> {
    const { users } = await admin.auth().listUsers(1000);
    return users;
  }
}
