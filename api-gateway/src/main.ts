import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import 'dotenv/config';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
