import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });

  const app = await NestFactory.create(AppModule);
  console.log(`
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
`);
  await app.listen(3000);
}

bootstrap();
