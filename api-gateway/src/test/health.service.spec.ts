import { HEALTH_RESPONSE, ServerStatus } from '../dto/types-dto-constants';
import { HealthService } from '../kafka/health.service';

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

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers({ advanceTimers: true });

    healthService = new HealthService();
    await healthService.onModuleInit();
  });

  afterEach(async () => {
    jest.useRealTimers();
  });

  it('should aggregate health responses correctly', async () => {
    const correlationId = 'test-correlation-id';
    const testResponse: ServerStatus = { service: 'UserService', status: 'OK' };
    const responsesArray = healthService.registerResponseHandler(correlationId);
    const mockMessage = {
      value: JSON.stringify({
        headers: {
          topic: HEALTH_RESPONSE,
          type: 'CreateHealthResponse',
          correlationId,
        },
        payload: testResponse,
      }),
    };

    global.simulateEachMessage({
      topic: HEALTH_RESPONSE,
      partition: 0,
      message: mockMessage,
    });

    const result = await healthService.waitForResponse(
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
