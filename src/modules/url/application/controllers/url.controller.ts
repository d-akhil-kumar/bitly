import { Body, Controller, Get, Post, Param, NotFoundException } from '@nestjs/common';
import { UrlService } from '../../domain/services/url.service';
import { CreateNewLinkDto } from '../dtos/create-new-link.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

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
    return originalUrl;
  }
}
