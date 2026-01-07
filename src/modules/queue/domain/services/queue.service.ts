import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { rabbitMQConfig } from '../../config/rabbitmq.config';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create(rabbitMQConfig);
  }

  async onModuleInit(): Promise<void> {
    try {
      this.logger.log('Connecting to RabbitMQ...');
      await this.client.connect();
      this.logger.log('✅ RabbitMQ connection established successfully');
    } catch (error) {
      this.logger.error('❌ RabbitMQ connection failed:', error.message);
      this.logger.error(
        '🛑 Shutting down application due to RabbitMQ connection failure',
      );
      process.exit(1);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.close();
      this.logger.log('🛑 RabbitMQ connection closed');
    } catch (error) {
      this.logger.error('⚠️ Error during RabbitMQ disconnect:', error.message);
    }
  }

  getClient(): ClientProxy {
    return this.client;
  }

  async emit(pattern: string, data: any): Promise<void> {
    this.client.emit(pattern, data);
  }

  async send<T>(pattern: string, data: any): Promise<T> {
    return lastValueFrom(this.client.send<T>(pattern, data));
  }
}
