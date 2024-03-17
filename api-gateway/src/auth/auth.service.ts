import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { HttpService } from '@nestjs/axios';
import { UserService } from '../user/user.service';
import { UserDTO, UserRecord } from '../shared-definitions/types-dto-constants';
import { RegisterUserDto } from './dtos/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: any): Promise<any> {
    const URL =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCzqUCT1u8pRuEPIhfNAsY5sQCjVVluPVk';

    const body = {
      email: loginDto.email,
      password: loginDto.password,
      returnSecureToken: loginDto.returnSecureToken,
    };

    const headers = {
      headers: { Accept: '*/*', 'Content-Type': 'application/json' },
    };

    return await this.httpService.axiosRef.post(URL, body, headers);
  }

  async register(registerDto: RegisterUserDto): Promise<any> {
    const userRecord = await admin.auth().createUser({
      email: registerDto.email,
      password: registerDto.password,
    });

    const userTest: UserDTO = {
      id: userRecord.uid,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
    };

    await this.userService.createUser(userTest);

    return userTest;
  }

  async validateUser(token: string): Promise<any> {
    try {
      const userRecord = await admin.auth().verifyIdToken(token);
      const userData = await admin.auth().getUser(userRecord.uid);

      return { userData };
    } catch (error) {
      return { error: error };
    }
  }
}
