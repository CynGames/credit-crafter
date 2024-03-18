import { HEALTH_REQUEST } from '../loan/dtos/types-dto-constants';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn(() => ({
    consumer: jest.fn(() => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(({ eachMessage }) => {
        global.triggerEachMessage = eachMessage;
      }),
    })),
  })),
}));

jest.mock('../health/health.service', () => ({
  AppService: jest.fn().mockImplementation(() => ({
    handleHealthCheckResponse: jest.fn(),
  })),
}));

jest.mock('../kafka/producer.service', () => ({
  AppService: jest.fn().mockImplementation(() => ({
    handleHealthCheckResponse: jest.fn(),
  })),
}));

import { ConsumerService } from '../health/consumer.service';
import { HealthService } from '../health/health.service';
import { ProducerService } from '../kafka/producer.service';

describe('ConsumerService', () => {
  let consumerService: ConsumerService;
  let appService: jest.Mocked<HealthService>;
  let producerService: jest.Mocked<ProducerService>;

  beforeEach(() => {
    jest.clearAllMocks();

    appService = new HealthService(
      producerService,
    ) as jest.Mocked<HealthService>;
    consumerService = new ConsumerService(appService);
  });

  it('should process HEALTH_REQUEST messages and call handleHealthCheckResponse', async () => {
    await consumerService.onModuleInit();

    const message = {
      value: JSON.stringify({
        headers: {
          topic: HEALTH_REQUEST,
          type: 'CreateHealthRequest',
          correlationId: 'test-correlation-id',
        },
        payload: {},
      }),
    };

    global.triggerEachMessage({
      topic: HEALTH_REQUEST,
      partition: 0,
      message,
    });

    expect(appService.handleHealthCheckResponse).toHaveBeenCalledWith(
      expect.anything(),
    );
  });

  afterEach(() => {
    global.triggerEachMessage = undefined;
  });
});
