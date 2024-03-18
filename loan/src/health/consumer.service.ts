// import {
//   Injectable,
//   OnApplicationShutdown,
//   OnModuleInit,
// } from '@nestjs/common';
// import { Kafka } from 'kafkajs';
// import { HealthService } from '../app.service';
// import {
//   HEALTH_REQUEST,
//   IsHealthMessageRequest,
//   PayloadTypeExtractor,
// } from '../loan/dtos/types-dto-constants';

// @Injectable()
// export class ConsumerService implements OnModuleInit, OnApplicationShutdown {
//   constructor(private readonly appService: HealthService) {}

//   private readonly kafka = new Kafka({
//     brokers: ['localhost:9092'],
//     clientId: 'credit-crafter-loan',
//   });

//   private readonly consumer = this.kafka.consumer({
//     groupId: 'loan-service-group',
//     sessionTimeout: 6000,
//   });

//   async onModuleInit() {
//     const topics = [HEALTH_REQUEST];

//     await this.consumer.connect();
//     await this.consumer.subscribe({ topics });

//     await this.consumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         console.log('[LOAN SERVICE] Received response');
//         console.log({
//           topic: topic,
//           partition: partition,
//         });

//         switch (topic) {
//           case HEALTH_REQUEST:
//             console.log(
//               '[LOAN SERVICE] Received message from health-check:' +
//                 message.value.toString(),
//             );

//             const parsedMessage = JSON.parse(message.value.toString());
//             const typedMessage = PayloadTypeExtractor(parsedMessage);

//             if (IsHealthMessageRequest(typedMessage)) {
//               await this.appService.handleHealthCheckResponse(typedMessage);
//             }
//             break;
//           default:
//             console.warn('Received message from unknown topic: ' + topic);
//             break;
//         }
//       },
//     });
//   }

//   async onApplicationShutdown() {
//     await this.consumer.disconnect();
//   }
// }
