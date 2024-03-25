import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookieToken = request.headers.cookie?.split('token=')[1];

    if (!cookieToken) return false;

    try {
      const decodedUser = await admin.auth().verifyIdToken(cookieToken);
      const userRecord = await admin.auth().getUser(decodedUser.uid);

      const roles = userRecord.customClaims?.roles
        ? userRecord.customClaims.roles
        : [];

      request.user = {
        id: userRecord.uid,
        email: userRecord.email,
        roles: roles,
      };

      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
