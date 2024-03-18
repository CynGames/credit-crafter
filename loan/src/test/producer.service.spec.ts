import { GenericMessage, ServerStatus } from '../loan/dtos/types-dto-constants';
import { ProducerService } from '../kafka/producer.service';

const mockSend = jest.fn();

jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockReturnValue({
      send: mockSend,
    }),
  })),
}));

describe('ProducerService', () => {
  let producerService: ProducerService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockClear();

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
        service: 'Loan Service',
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
