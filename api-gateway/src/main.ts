import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log(logo);

  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Credit Crafter API')
    .setDescription('The Credit Crafter API description')
    .setVersion('1.0')
    .addTag('credit-crafter')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

const logo = `
  ______   _______   ________  _______   ______ ________
 /      \ /       \ /        |/       \ /      /        |
/$$$$$$  |$$$$$$$  |$$$$$$$$/ $$$$$$$  |$$$$$$/$$$$$$$$/
$$ |  $$/ $$ |__$$ |$$ |__    $$ |  $$ |  $$ |    $$ |
$$ |      $$    $$< $$    |   $$ |  $$ |  $$ |    $$ |
$$ |   __ $$$$$$$  |$$$$$/    $$ |  $$ |  $$ |    $$ |
$$ \__/  | $$ |  $$ |$$ |_____ $$ |__$$ | _$$ |_   $$ |
$$    $$/ $$ |  $$ |$$       |$$    $$/ / $$   |  $$ |
 $$$$$$/  $$/   $$/ $$$$$$$$/ $$$$$$$/  $$$$$$/   $$/

  
  ______   _______    ______   ________ ________ ________  _______
 /      \ /       \  /      \ /        /        /        |/       \
/$$$$$$  |$$$$$$$  |/$$$$$$  |$$$$$$$$/$$$$$$$$/$$$$$$$$/ $$$$$$$  |
$$ |  $$/ $$ |__$$ |$$ |__$$ |$$ |__      $$ |  $$ |__    $$ |__$$ |
$$ |      $$    $$< $$    $$ |$$    |     $$ |  $$    |   $$    $$<
$$ |   __ $$$$$$$  |$$$$$$$$ |$$$$$/      $$ |  $$$$$/    $$$$$$$  |
$$ \__/  | $$ |  $$ |$$ |  $$ |$$ |        $$ |  $$ |_____ $$ |  $$ |
$$    $$/ $$ |  $$ |$$ |  $$ |$$ |        $$ |  $$       |$$ |  $$ |
 $$$$$$/  $$/   $$/ $$/   $$/ $$/         $$/   $$$$$$$$/ $$/   $$/
`;

bootstrap();
