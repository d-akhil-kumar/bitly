import { Injectable } from '@nestjs/common';
import { CreateNewLinkDto } from '../../application/dtos/create-new-link.dto';
import { UrlRepository } from '../repositories/url.repository';
import { RedisService } from '../../../redis/domain/services/redis.service';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly redisService: RedisService,
  ) {}

  public async createNewLink(dto: CreateNewLinkDto): Promise<string> {
    const urlEntity = await this.urlRepository.insertUrl(dto.code, dto.url);

    const cacheKey = `url:${dto.code}`;
    await this.redisService.set(cacheKey, dto.url);

    return urlEntity.code;
  }

  public async getOriginalUrl(code: string): Promise<string | null> {
    const cacheKey = `url:${code}`;
    const cachedUrl = await this.redisService.get(cacheKey);
    if (cachedUrl) {
      return cachedUrl;
    }

    const urlEntity = await this.urlRepository.findByCode(code);
    if (urlEntity) {
      await this.redisService.set(cacheKey, urlEntity.longUrl);
    }
    return urlEntity ? urlEntity.longUrl : null;
  }
}
