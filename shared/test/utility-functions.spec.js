"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_functions_1 = require("../core/utility-functions");
describe('GenerateUniqueId utility function', () => {
    it('should begin with a fixed string', () => {
        const output = (0, utility_functions_1.GenerateUniqueId)();
        expect(output).toContain('unique-id-');
    });
    it('should be different every time', () => {
        const first = (0, utility_functions_1.GenerateUniqueId)();
        const second = (0, utility_functions_1.GenerateUniqueId)();
        expect(first).not.toBe(second);
    });
});
describe('PayloadTypeExtractor utility function', () => {
    it('should purposefully throw an error for an unrecognized message type', () => {
        const input = {
            headers: {
                topic: 'unexpected-topic',
                type: 'UnexpectedType',
                correlationId: 'unique-id-123',
            },
        };
        expect(() => (0, utility_functions_1.PayloadTypeExtractor)(input)).toThrow(Error);
    });
});
