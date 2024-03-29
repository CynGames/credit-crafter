import { HealthService } from '../health/health.service';
import { ProducerService } from '../kafka/producer.service';
import {
  HEALTH_RESPONSE,
  HealthMessageRequest,
} from '../loan/dtos/types-dto-constants';

jest.mock('../kafka/producer.service', () => ({
  ProducerService: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn(),
  })),
}));

describe('AppService', () => {
  let appService: HealthService;
  let mockProducerService: jest.Mocked<ProducerService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProducerService = new ProducerService() as jest.Mocked<ProducerService>;
    appService = new HealthService(mockProducerService);
  });

  it('should handle health check response correctly', async () => {
    const healthMessageRequest: HealthMessageRequest = {
      headers: {
        topic: 'health-check-request',
        type: 'CreateHealthRequest',
        correlationId: 'unique-correlation-id',
      },
      payload: null,
    };

    await appService.handleHealthCheckResponse(healthMessageRequest);

    expect(mockProducerService.sendMessage).toHaveBeenCalledWith({
      headers: {
        topic: HEALTH_RESPONSE,
        type: 'CreateHealthResponse',
        correlationId: 'unique-correlation-id',
      },
      payload: {
        service: 'Loan Service',
        status: 'OK',
      },
    });
    expect(mockProducerService.sendMessage).toHaveBeenCalledTimes(1);
  });
});
