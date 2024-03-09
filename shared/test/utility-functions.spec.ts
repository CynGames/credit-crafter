import { GenerateUniqueId, PayloadTypeExtractor } from '../core/utility-functions';
import { MessageType, SpecificMessage } from '../core/message-types';

describe('GenerateUniqueId utility function', () => {
  it('should begin with a fixed string', () => {
    const output = GenerateUniqueId();
    expect(output).toContain('unique-id-');
  });
  
  it('should be different every time', () => {
    const first = GenerateUniqueId();
    const second = GenerateUniqueId();
    expect(first).not.toBe(second);
  });
});

describe('PayloadTypeExtractor utility function', () => {
  it('should purposefully throw an error for an unrecognized message type', () => {
    const input = {
      headers: {
        topic: 'unexpected-topic',
        type: 'UnexpectedType' as MessageType,
        correlationId: 'unique-id-123',
      },
    } as SpecificMessage;
    
    expect(() => PayloadTypeExtractor(input)).toThrow(Error);
  });
});