import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../../database/domain/services/database.service';
import { UrlEntity } from '../../../database/domain/entities/url.entity';

@Injectable()
export class UrlRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private getRepository(): Repository<UrlEntity> {
    return this.databaseService.getDataSource().getRepository(UrlEntity);
  }

  async insertUrl(code: string, longUrl: string): Promise<UrlEntity> {
    const repository = this.getRepository();
    const urlEntity = repository.create({
      code,
      longUrl,
    });

    return await repository.save(urlEntity);
  }

  async findByCode(code: string): Promise<UrlEntity | null> {
    return await this.getRepository().findOne({ where: { code } });
  }

  async findById(id: number): Promise<UrlEntity | null> {
    return await this.getRepository().findOne({ where: { id } });
  }
}
