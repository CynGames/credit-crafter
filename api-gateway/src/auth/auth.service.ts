import { Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/auth.service.interface';
import { RegisterUserDto } from './dtos/register-user.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService implements IAuthService {
  async validateUser(token: string): Promise<any> {
    try {
      const userRecord = await admin.auth().verifyIdToken(token);
      const userData = await admin.auth().getUser(userRecord.uid);

      return { userData };
    } catch (error) {
      return { error: error };
    }
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<any> {
    try {
      const userRecord = await admin.auth().createUser({
        email: registerUserDto.email,
        password: registerUserDto.password,
      });

      const db = admin.firestore();
      const userRef = db.collection('users-auth').doc(userRecord.uid);
      await userRef.set({
        firstName: registerUserDto.firstName,
        lastName: registerUserDto.lastName,
        email: registerUserDto.email,
      });

      return { userId: userRecord.uid };
    } catch (error) {
      return { error: error };
    }
  }
}
