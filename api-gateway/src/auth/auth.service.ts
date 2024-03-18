import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { LoginUserDTO } from './dtos/login-user.dto';
import { UserService } from '../user/user.service';
import { HttpService } from '@nestjs/axios';
import { RegisterUserDTO } from './dtos/register-user-d-t.o';
import {
  UserCreatePayload,
  UserDTO,
} from '../shared-definitions/types-dto-constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
  ) {}

  async login(loginDTO: LoginUserDTO): Promise<{ token: string }> {
    try {
      const URL =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCzqUCT1u8pRuEPIhfNAsY5sQCjVVluPVk';

      const body = {
        email: loginDTO.email,
        password: loginDTO.password,
        returnSecureToken: true,
      };

      const headers = {
        headers: { Accept: '*/*', 'Content-Type': 'application/json' },
      };

      const { data } = await this.httpService.axiosRef.post(URL, body, headers);

      console.log(data);

      return { token: data.idToken };
    } catch (e) {
      console.log(e, null);
    }
  }

  async register(registerDTO: RegisterUserDTO): Promise<UserCreatePayload> {
    const userRecord = await admin.auth().createUser({
      email: registerDTO.email,
      password: registerDTO.password,
    });

    const userDTO: UserDTO = {
      id: userRecord.uid,
      firstName: registerDTO.firstName,
      lastName: registerDTO.lastName,
      email: registerDTO.email,
    };

    const result = await this.userService.createUser(userDTO);

    return { data: { success: result, user: userDTO } };
  }
}
