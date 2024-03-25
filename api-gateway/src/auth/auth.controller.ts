import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, RegisterUserDTO } from './dtos/register-user-dto';
import { LoginUserDTO, LoginUserResponse } from './dtos/login-user.dto';
import { Response } from 'express';
import admin from 'firebase-admin';
import { ApiTags } from '@nestjs/swagger';
import {
  AppApiCreatedResponse,
  AppApiOkResponse,
} from '../decorators/app-api.decorators';
import { UserRecord } from './dtos/user-record.dto';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AppApiCreatedResponse({ type: LoginUserResponse })
  @Post('/login')
  async login(
    @Body() loginDTO: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserResponse> {
    const { token } = await this.authService.login(loginDTO);
    res.cookie('token', token, { httpOnly: true });

    return { message: 'Login successful' };
  }

  @AppApiCreatedResponse({ type: CreateUserDTO })
  @Post('/register')
  async register(@Body() registerDTO: RegisterUserDTO): Promise<CreateUserDTO> {
    return await this.authService.register(registerDTO);
  }

  // add guard
  @AppApiOkResponse({ type: UserRecord })
  @Get('/listUsers')
  async getAccounts(): Promise<UserRecord[]> {
    const { users } = await admin.auth().listUsers(1000);
    return users;
  }
}
