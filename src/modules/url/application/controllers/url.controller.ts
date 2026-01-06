import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
