import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { LoginUserDTO } from './dtos/login-user.dto';
import { UserService } from '../user/user.service';
import { HttpService } from '@nestjs/axios';
import { CreateUserDTO, RegisterUserDTO } from './dtos/register-user-dto';
import { UserDTO } from '../shared-definitions/types-dto-constants';

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

      const { data } = await this.httpService.axiosRef.post(URL, body);

      return { token: data.idToken };
    } catch (e) {
      console.log(e, null);
    }
  }

  async register(registerDTO: RegisterUserDTO): Promise<CreateUserDTO> {
    try {
      const userRecord = await admin.auth().createUser({
        email: registerDTO.email,
        password: registerDTO.password,
      });

      await admin.auth().setCustomUserClaims(userRecord.uid, {
        roles: registerDTO.roles ?? ['user'],
      });

      const newUser: UserDTO = {
        id: userRecord.uid,
        firstName: registerDTO.firstName,
        lastName: registerDTO.lastName,
        email: registerDTO.email,
        roles: registerDTO.roles,
      };

      const result = await this.userService.createUser(newUser);

      if (result.status == 'error') {
        await admin.auth().deleteUser(userRecord.uid);
      }

      return result;
    } catch (e) {
      return { status: 'email already exists', data: null };
    }
  }
}
