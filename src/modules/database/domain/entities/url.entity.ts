import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'url' })
export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'code', type: 'varchar', length: 20 })
  code: string;

  @Column({ name: 'long_url', type: 'text' })
  longUrl: string;

  @Column({ name: 'click_count', type: 'integer', default: 0 })
  clickCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
