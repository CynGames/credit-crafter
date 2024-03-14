import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../../serviceAccount.json';

const firebase_params: ServiceAccount = {
  projectId: serviceAccount.project_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
};

@Injectable()
export class PreAuthMiddleware implements NestMiddleware {
  // private defaultApp: any;

  constructor() {
    // this.defaultApp = firebase.initializeApp({
    // credential: firebase.credential.cert(firebase_params),
    // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    // });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      // req['user'] = await this.defaultApp.auth().verifyIdToken(token);
    } catch (error) {
      return res.status(401).send('Unauthorized');
    }

    next();
  }
}
