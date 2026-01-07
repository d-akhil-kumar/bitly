import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { RedisModule } from './modules/redis/redis.module';
import { QueueModule } from './modules/queue/queue.module';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [DatabaseModule, RedisModule, QueueModule, UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
