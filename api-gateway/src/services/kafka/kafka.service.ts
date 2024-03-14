import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer, Message } from 'kafkajs';
import { partition } from 'rxjs';

@Injectable()
export class KafkaService {
    private readonly kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;
    private readonly logger = new Logger(KafkaService.name);

    constructor(){
        this.kafka = new Kafka({
            clientId: 'api-gateway',
            brokers: ['localhost:9092'],
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'api-gateway-group'});
    }

    async connect() {
        try {
            await this.producer.connect();
            await this.consumer.connect();
        } catch (error) {
            this.logger.error(`Error connecting to Kafka: ${error.message}`);
            throw error;
        }
    }

    async sendMessage(topic: string, payload: any) {
        try {
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(payload) }],
            });
        } catch (error) {
            this.logger.error(`Error sending message to Kafka: ${error.message}`);
            throw error;
        }
    }

    async listenForMessages(topic: string, callback: (message: Message) => void) {
        try {
            await this.consumer.subscribe({ topic });
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    callback(message);
                },
            });
        } catch (error) {
            this.logger.error(`Error listening for messages from Kafka: ${error.message}`);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.producer.disconnect();
            await this.consumer.disconnect();
        } catch (error) {
            this.logger.error(`Error disconnecting from Kafka: ${error.message}`);
            throw error;
        }
    }
}
