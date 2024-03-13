"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEmptyMessage = exports.IsHealthMessageRequest = exports.IsHealthMessageResponse = void 0;
function IsHealthMessageResponse(message) {
    return message.headers.type === 'CreateHealthResponse';
}
exports.IsHealthMessageResponse = IsHealthMessageResponse;
function IsHealthMessageRequest(message) {
    return message.headers.type === 'CreateHealthRequest';
}
exports.IsHealthMessageRequest = IsHealthMessageRequest;
function IsEmptyMessage(message) {
    return message.headers.type === 'EmptyMessage';
}
exports.IsEmptyMessage = IsEmptyMessage;
