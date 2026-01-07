import { RmqOptions, Transport } from '@nestjs/microservices';

export const getRabbitMQConfig = (): RmqOptions['options'] => ({
  urls: [
    `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASSWORD || 'guest'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || '5672'}`,
  ],
  queue: 'flashlink_queue',
  queueOptions: {
    durable: true,
  },
});

export const rabbitMQConfig: RmqOptions = {
  transport: Transport.RMQ,
  options: getRabbitMQConfig(),
};
