import { Injectable } from '@nestjs/common';
import { Kafka, Producer, Consumer, Message } from 'kafkajs';
import { partition } from 'rxjs';

@Injectable()
export class KafkaService {
    private readonly kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;

    constructor(){
        this.kafka = new Kafka({
            clientId: 'api-gateway',
            brokers: ['kafka-broker-1:9092', 'kafka-broker-2:9092'],
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'api-gateway-group'});
    }

    async connect() {
        await this.producer.connect();
        await this.consumer.connect();
    }

    async sendMessage(topic: string, payload: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(payload) }],
        });
    }

    async listenForMessages(topic: string, callback: (message: Message)=> void) {
        await this.consumer.subscribe({ topic });
        await this.consumer.run({
            eachMessage: async ( { topic, partition, message }) =>{
                callback(message);
            }
        })
    }

    async disconect(){
        await this.producer.disconnect();
        await this.consumer.disconnect();
    }
}
