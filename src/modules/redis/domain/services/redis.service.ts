import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || 'flashlink_redis_pass',
      db: 1,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      this.logger.log('Connecting to Redis...');
      await this.client.ping();
      this.logger.log('✅ Redis connection established successfully');
    } catch (error) {
      this.logger.error('❌ Redis connection failed:', error.message);
      this.logger.error(
        '🛑 Shutting down application due to Redis connection failure',
      );
      process.exit(1);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
      this.logger.log('🛑 Redis connection closed');
    } catch (error) {
      this.logger.error('⚠️ Error during Redis disconnect:', error.message);
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
