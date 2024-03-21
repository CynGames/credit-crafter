import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization?.split('Bearer ')[1];
    const cookieToken = request.headers.cookie?.split('token=')[1];

    if (!authToken && !cookieToken) return false;

    const token = authToken || cookieToken;

    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      const userRecord = await admin.auth().getUser(decodedUser.uid);

      request.user = {
        id: userRecord.uid,
        email: userRecord.email,
        admin: decodedUser.admin ?? false,
      };

      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
