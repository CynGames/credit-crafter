import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from './interface/auth.service.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import * as admin from 'firebase-admin';
import { response } from 'express'

@Injectable()
export class AuthService implements IAuthService {
  async validateUser(token: string): Promise<any> {
    const userRecord = await admin.auth().verifyIdToken(token);
    const userData = await admin.auth().getUser(userRecord.uid);

    return { userData };
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<any> {
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
  }
  async loginUser(email: string, password: string): Promise<any> {
    try {
      const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCzqUCT1u8pRuEPIhfNAsY5sQCjVVluPVk';
      const body = {
        email: email,
        password: password
      };
      console.log(body);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      
      
      if (responseData && responseData.idToken) {
       
        const customToken = responseData.idToken;
        return customToken;
      } else {
        throw new Error('Invalid response from authentication service');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  
}
