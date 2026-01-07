import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from '../../domain/services/url.service';
import { CreateNewLinkDto } from '../dtos/create-new-link.dto';
import { QueueService } from 'src/modules/queue/domain/services/queue.service';
import { EventPattern } from '@nestjs/microservices';
import { WorkerService } from '../../domain/repositories/worker.service';

@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly queueService: QueueService,
    private readonly workerService: WorkerService,
  ) {}

  @Post('/shorten')
  async createNewLink(
    @Body() createNewLinkDto: CreateNewLinkDto,
  ): Promise<string> {
    const shortUrl = await this.urlService.createNewLink(createNewLinkDto);
    return shortUrl;
  }

  @Get('/:code')
  async getOriginalUrl(@Param('code') code: string): Promise<string> {
    const originalUrl = await this.urlService.getOriginalUrl(code);
    if (!originalUrl) {
      throw new NotFoundException(`URL with code '${code}' not found`);
    }

    // Emit event to RabbitMQ queue
    this.queueService.emit('url.clicked', {
      code: code,
    });
    return originalUrl;
  }

  @EventPattern('url.clicked')
  async handleUrlClick(data: { code: string }) {
    console.log('Received click for:', data.code);
    await this.workerService.handleUrlClicked(data);
  }
}
