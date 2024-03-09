import { GenerateUniqueId, GenericMessage } from '../dto/types-dto-constants';
import { ProducerService } from '../kafka/producer.service';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn().mockImplementation(() => ({
    producer: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    })),
  })),
}));

describe('ProducerService', () => {
  let producerService: ProducerService;

  beforeEach(async () => {
    jest.clearAllMocks();

    producerService = new ProducerService();
    await producerService.onModuleInit();
  });

  it('should send a message to the correct Kafka topic', async () => {
    const correlationId = GenerateUniqueId();
    const testMessage: GenericMessage<void> = {
      headers: {
        topic: 'test-request',
        type: 'CreateHealthRequest',
        correlationId,
      },
      payload: null,
    };

    await producerService.sendMessage(testMessage);

    expect((producerService as any).producer.send).toHaveBeenCalledWith({
      topic: testMessage.headers.topic,
      messages: [{ value: JSON.stringify(testMessage) }],
    });
  });
});
