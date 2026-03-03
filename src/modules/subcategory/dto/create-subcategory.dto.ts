import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;  // ✅ definite assignment

  @IsOptional()
  @IsString()
  description?: string; // optional, no ! needed

  @IsNotEmpty()
  @IsInt()
  categoryId!: number; // ✅ definite assignment
}