import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UrlRepository } from './url.repository';

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WorkerService.name);
  private clickBuffer: string[] = [];
  private flushInterval: NodeJS.Timeout;
  private readonly BUFFER_SIZE = 50;
  private readonly FLUSH_INTERVAL_MS = 10000; // 10 seconds

  constructor(private readonly urlRepository: UrlRepository) {}

  onModuleInit() {
    // Start the interval timer to flush buffer every 1 minute
    this.flushInterval = setInterval(() => {
      this.flushBuffer();
    }, this.FLUSH_INTERVAL_MS);

    this.logger.log('✅ Worker service initialized with batch processing');
  }

  onModuleDestroy() {
    // Clear interval and flush any remaining data
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushBuffer();
    this.logger.log('🛑 Worker service destroyed, buffer flushed');
  }

  @EventPattern('url.clicked')
  async handleUrlClicked(data: any) {
    this.logger.debug(`📨 Received url.clicked event for code: ${data.code}`);

    // Add to buffer
    this.clickBuffer.push(data.code);

    // If buffer reaches 50, flush immediately
    if (this.clickBuffer.length >= this.BUFFER_SIZE) {
      await this.flushBuffer();
    }
  }

  private async flushBuffer() {
    if (this.clickBuffer.length === 0) {
      return;
    }

    const codesToProcess = [...this.clickBuffer];
    this.clickBuffer = []; // Clear buffer immediately

    try {
      this.logger.log(
        `🔄 Flushing ${codesToProcess.length} click events to database`,
      );
      await this.urlRepository.bulkIncrementClickCount(codesToProcess);
      this.logger.log(
        `✅ Successfully updated click counts for ${codesToProcess.length} events`,
      );
    } catch (error) {
      this.logger.error(`❌ Failed to flush buffer:`, error.message);
      // Re-add failed items back to buffer for retry
      this.clickBuffer.push(...codesToProcess);
    }
  }
}
