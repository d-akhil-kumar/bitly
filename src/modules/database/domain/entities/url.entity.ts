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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
