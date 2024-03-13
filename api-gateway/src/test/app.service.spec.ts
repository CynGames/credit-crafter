import { AppService } from '../app.service';
import { HealthService } from '../kafka/health.service';
import { ProducerService } from '../kafka/producer.service';

jest.mock('../kafka/producer.service', () => ({
  ProducerService: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn(),
  })),
}));

jest.mock('../kafka/health.service', () => ({
  HealthService: jest.fn().mockImplementation(() => ({
    registerResponseHandler: jest.fn().mockReturnValue([]),
    waitForResponse: jest
      .fn()
      .mockReturnValue({ data: [{ service: 'UserService', status: 'OK' }] }),
  })),
}));

describe('App Service', () => {
  let producerService: jest.Mocked<ProducerService>;
  let healthService: jest.Mocked<HealthService>;
  let appService: AppService;

  beforeEach(async () => {
    jest.clearAllMocks();

    producerService = new ProducerService() as jest.Mocked<ProducerService>;
    healthService = new HealthService() as jest.Mocked<HealthService>;
    appService = new AppService(producerService, healthService);
  });

  it('should return the correct after calling every function', async () => {
    const result = await appService.createHealthRequestMessage();

    expect(producerService.sendMessage).toHaveBeenCalled();
    expect(healthService.registerResponseHandler).toHaveBeenCalled();
    expect(healthService.waitForResponse).toHaveBeenCalled();
    expect(result).toEqual({
      data: [{ service: 'UserService', status: 'OK' }],
    });
  });
});
