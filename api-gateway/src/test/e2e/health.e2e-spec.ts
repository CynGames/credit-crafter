import * as request from 'supertest';
import { Kafka } from 'kafkajs';

describe('API Gateway to Microservice E2E Test', () => {
  let kafkaConsumer: any;

  beforeAll(async () => {
    const kafka = new Kafka({ brokers: ['localhost:9092'] });
    kafkaConsumer = kafka.consumer({ groupId: 'test-group' });

    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe({ topic: 'health-request' });
  });

  afterAll(async () => {
    await kafkaConsumer.disconnect();
  });

  it('sends a message through the API Gateway and processes it in the microservice', async () => {
    const response = await request('http://localhost:3000')
      .get('/health')
      .send({});

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ service: 'API Gateway', status: 'OK' }),
        expect.objectContaining({ service: 'Loan Service', status: 'OK' }),
        expect.objectContaining({ service: 'User Service', status: 'OK' }),
      ]),
    );
  }, 5000);
});
