import {
  HEALTH_RESPONSE,
  ServerStatus,
} from '../shared-definitions/types-dto-constants';
import { HealthConsumer } from '../health/health.consumer';

jest.mock('kafkajs', () => ({
  Kafka: jest.fn(() => ({
    consumer: jest.fn(() => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(({ eachMessage }) => {
        global.simulateEachMessage = (message: any) => eachMessage(message);
      }),
    })),
  })),
}));

describe('HealthConsumer', () => {
  let healthConsumer: HealthConsumer;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers({ advanceTimers: true });

    healthConsumer = new HealthConsumer();
    await healthConsumer.onModuleInit();
  });

  afterEach(async () => {
    jest.useRealTimers();
  });

  it('should aggregate health responses correctly', async () => {
    const correlationId = 'test-correlation-id';
    const testResponse: ServerStatus = { service: 'UserService', status: 'OK' };
    const responsesArray =
      healthConsumer.registerResponseHandler(correlationId);
    const mockMessage = {
      value: JSON.stringify({
        headers: {
          topic: HEALTH_RESPONSE,
          type: 'CreateHealthResponse',
          correlationId: correlationId,
          userRecord: null,
        },
        payload: testResponse,
      }),
    };

    global.simulateEachMessage({
      topic: HEALTH_RESPONSE,
      partition: 0,
      message: mockMessage,
    });

    const result = await healthConsumer.waitForResponse(
      correlationId,
      responsesArray,
    );

    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ service: 'API Gateway', status: 'OK' }),
        expect.objectContaining({ service: 'UserService', status: 'OK' }),
      ]),
    );

    expect(result.data.length).toBe(2);
  });
});
