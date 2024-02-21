import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async handleMessage(message: string) {
    console.log(`[LOAN SERVICE] Message Received: ${message}`);
  }
}
