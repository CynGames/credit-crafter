import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestUserDto } from '../dto/request-user.dto';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestUserDto;
    const idToken = request.headers.cookie.split('token=')[1];
   

    if (!idToken){ return false};

    try { 
      // const user = await admin.auth().verifyIdToken(idToken); 
      // request.user = await admin.auth().getUser(user.uid);
      const user = {
        uid: "fbf12830-b953-42ed-855d-0a798b7c6f54"
      }
      request.user = user;
      return true;
    } catch (error) {
      return false;
    }
  }
}
