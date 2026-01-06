import { IsString } from 'class-validator';

export class CreateNewLinkDto {
  @IsString()
  url: string;

  @IsString()
  code: string;
}
