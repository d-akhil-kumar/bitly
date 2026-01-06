import { Injectable } from '@nestjs/common';
import { CreateNewLinkDto } from '../../application/dtos/create-new-link.dto';
import { UrlRepository } from '../repositories/url.repository';

@Injectable()
export class UrlService {
  constructor(private readonly urlRepository: UrlRepository) {}

  public async createNewLink(dto: CreateNewLinkDto): Promise<string> {
    const urlEntity = await this.urlRepository.insertUrl(dto.code, dto.url);
    return urlEntity.code;
  }

  public async getOriginalUrl(code: string): Promise<string | null> {
    const urlEntity = await this.urlRepository.findByCode(code);
    return urlEntity ? urlEntity.longUrl : null;
  }
}