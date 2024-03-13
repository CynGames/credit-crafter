import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestUserDto } from '../dto/request-user.dto';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestUserDto;
    const idToken = request.headers.authorization?.split('Bearer ')[1];

    if (!idToken) return false;

    try {
      request.user = await admin.auth().verifyIdToken(idToken);
      return true;
    } catch (error) {
      return false;
    }
  }
}
