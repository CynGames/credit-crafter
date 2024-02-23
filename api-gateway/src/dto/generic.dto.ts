/*
- DTO - Hacerlo tipado. Por cada shape diferente, crear un tipo o funcion que wrapee? Generics oriented? Que, para publicar, el mensaje tenga un tipo definido?

Ej: type LoanCreated {id: 1} | type LoanUpgraded {newLimit: 1000}

Crear wrappers que tengan un object con {type: 'LoanCreated', payload:{...mutable}}
 */

// interface MessageHeader {
//   correlationId: string;
//   offset: string;
// }
//
// interface MessagePayload {
//   value: string;
// }
//
// interface CustomMessage {
//   header: MessageHeader;
//   payload: MessagePayload;
// }

// function kafkaMessageConverter(
//   kafkaMessage: KafkaMessage,
// ): CustomMessage {
//   const correlationId = kafkaMessage.headers?.correlationId?.toString('utf-8');
//   const offset = kafkaMessage.offset.toString();
//   const value = kafkaMessage.value?.toString('utf-8');
//
//   if (!correlationId) {
//     throw new Error('Invalid message');
//   }
//
//   return {
//     header: {
//       correlationId,
//       offset,
//     },
//     payload: {
//       value,
//     },
//   };
// }
