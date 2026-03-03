import { IsNotEmpty, IsString, IsInt, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVariantDto } from './create-variant.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string; // ✅ add !

  @IsOptional()
  @IsString()
  description?: string; // optional, keep ?

  @IsInt()
  @Type(() => Number)
  categoryId!: number;

  @IsInt()
  @Type(() => Number)
  subCategoryId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}