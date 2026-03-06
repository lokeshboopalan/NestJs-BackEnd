import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSliderDto {
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  status?: boolean;
}
