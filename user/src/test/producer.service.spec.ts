import { GenericMessage, ServerStatus } from '../dto/types-dto-constants';

const mockSend = jest.fn();

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn().mockImplementation(() => ({
      producer: jest.fn().mockImplementation(() => ({
        send: mockSend,
      })),
    })),
  };
});

import { ProducerService } from '../kafka/producer.service';

describe('ProducerService', () => {
  let producerService: ProducerService;

  beforeEach(() => {
    jest.clearAllMocks();

    producerService = new ProducerService();
  });

  it('should send a message to the correct Kafka topic', async () => {
    const genericMessage: GenericMessage<ServerStatus> = {
      headers: {
        topic: 'test-topic',
        type: 'CreateHealthResponse',
        correlationId: '12345',
      },
      payload: {
        service: 'User Service',
        status: 'OK',
      },
    };

    await producerService.sendMessage(genericMessage);

    expect(mockSend).toHaveBeenCalledWith({
      topic: 'test-topic',
      messages: [{ value: JSON.stringify(genericMessage) }],
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
