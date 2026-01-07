import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';
import { QueueModule } from '../queue/queue.module';
import { UrlController } from './application/controllers/url.controller';
import { UrlService } from './domain/services/url.service';
import { UrlRepository } from './domain/repositories/url.repository';
import { WorkerService } from './domain/repositories/worker.service';

@Module({
  imports: [DatabaseModule, RedisModule, QueueModule],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository, WorkerService],
})
export class UrlModule {}
