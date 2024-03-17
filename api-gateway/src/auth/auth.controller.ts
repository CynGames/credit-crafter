import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dtos/register-user-d-t.o';
import { LoginUserDTO } from './dtos/login-user.dto';
import admin, { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;
import { UserCreatePayload } from '../shared-definitions/types-dto-constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDTO: LoginUserDTO): Promise<any> {
    const { data } = await this.authService.login(loginDTO);
    return data;
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
