"use strict";
// export function PayloadTypeExtractor(
//   message: SpecificMessage,
// ): SpecificMessage {
//   if (IsHealthMessageResponse(message)) return message;
//   if (IsHealthMessageRequest(message)) return message;
//   if (IsEmptyMessage(message)) return message;
//
//   throw new Error(`Unknown message type: ${message}`);
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateUniqueId = void 0;
function GenerateUniqueId() {
    return 'unique-id-' + Math.random().toString(16).substr(4, 10);
}
exports.GenerateUniqueId = GenerateUniqueId;
