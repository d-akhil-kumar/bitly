import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';
import { UrlController } from './application/controllers/url.controller';
import { UrlService } from './domain/services/url.service';
import { UrlRepository } from './domain/repositories/url.repository';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [UrlController],
  providers: [UrlService, UrlRepository],
})
export class UrlModule {}
