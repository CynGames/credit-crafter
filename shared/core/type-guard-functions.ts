// import {
//   EmptyMessage, FetchEmailUser, FetchIdUser,
//   SpecificMessage,
// } from './message-types';
//
// export function IsUserEmailFetchMessage(
//   message: SpecificMessage,
// ): message is FetchEmailUser {
//   return message.headers.type === 'FetchEmailUser';
// }
//
// export function IsUserIdFetchMessage(
//   message: SpecificMessage,
// ): message is FetchIdUser {
//   return message.headers.type === 'FetchIdUser';
// }
//
// // export function IsHealthMessageResponse(
// //   message: SpecificMessage,
// // ): message is HealthMessageResponse {
// //   return message.headers.type === 'CreateHealthResponse';
// // }
// //
// // export function IsHealthMessageRequest(
// //   message: SpecificMessage,
// // ): message is HealthMessageRequest {
// //   return message.headers.type === 'CreateHealthRequest';
// // }
//
// export function IsEmptyMessage(
//   message: SpecificMessage,
// ): message is EmptyMessage {
//   return message.headers.type === 'EmptyMessage';
// }
