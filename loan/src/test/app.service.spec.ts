import { AppService } from '../app.service';
import { ProducerService } from '../kafka/producer.service';
import {
  HEALTH_RESPONSE,
  HealthMessageRequest,
} from '../dto/types-dto-constants';

jest.mock('../kafka/producer.service', () => ({
  ProducerService: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn(),
  })),
}));

describe('AppService', () => {
  let appService: AppService;
  let mockProducerService: jest.Mocked<ProducerService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProducerService = new ProducerService() as jest.Mocked<ProducerService>;
    appService = new AppService(mockProducerService);
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
