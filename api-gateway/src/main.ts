import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import 'dotenv/config';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../serviceAccount.json';

const firebase_params: ServiceAccount = {
  projectId: serviceAccount.project_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
};

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    // credential: admin.credential.cert(firebase_params),
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
