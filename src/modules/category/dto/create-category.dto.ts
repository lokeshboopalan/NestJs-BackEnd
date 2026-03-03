import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string; // ✅ add !

  @IsOptional()
  @IsString()
  description?: string; // keep optional
}