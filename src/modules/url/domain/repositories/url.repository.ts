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

  async bulkIncrementClickCount(codes: string[]): Promise<void> {
    if (codes.length === 0) return;

    // Count occurrences of each code
    const codeCountMap = codes.reduce((acc, code) => {
      acc[code] = (acc[code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Build a single SQL query to update all codes at once
    const caseStatements = Object.entries(codeCountMap)
      .map(([code, count]) => `WHEN code = '${code}' THEN click_count + ${count}`)
      .join(' ');

    const codesString = Object.keys(codeCountMap)
      .map((code) => `'${code}'`)
      .join(', ');

    const query = `
      UPDATE url 
      SET click_count = CASE 
        ${caseStatements}
      END
      WHERE code IN (${codesString})
    `;

    await this.databaseService.getDataSource().query(query);
  }
}
