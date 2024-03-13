"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateUniqueId = exports.PayloadTypeExtractor = void 0;
const type_guard_functions_1 = require("./type-guard-functions");
function PayloadTypeExtractor(message) {
    if ((0, type_guard_functions_1.IsHealthMessageResponse)(message))
        return message;
    if ((0, type_guard_functions_1.IsHealthMessageRequest)(message))
        return message;
    if ((0, type_guard_functions_1.IsEmptyMessage)(message))
        return message;
    throw new Error(`Unknown message type: ${message}`);
}
exports.PayloadTypeExtractor = PayloadTypeExtractor;
function GenerateUniqueId() {
    return 'unique-id-' + Math.random().toString(16).substr(4, 10);
}
exports.GenerateUniqueId = GenerateUniqueId;
