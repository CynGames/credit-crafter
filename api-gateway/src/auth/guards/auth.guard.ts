import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestUserDto } from '../dtos/request-user.dto';
import admin from 'firebase-admin';
import { UserDTO } from '../../shared-definitions/types-dto-constants';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestUserDto;
    const idToken = request.headers.authorization?.split('Bearer ')[1];

    if (!idToken) return false;

    try {
      const decodedUser = await admin.auth().verifyIdToken(idToken);
      const userRecord = await admin.auth().getUser(decodedUser.uid);
      request.user = { id: userRecord.uid, email: userRecord.email };
      return true;
    } catch (error) {
      return false;
    }
  }
}
