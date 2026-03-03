import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateVariantDto {
  @IsNotEmpty()
  @IsString()
  name!: string; // definite assignment

  @IsNotEmpty()
  @IsNumber()
  price!: number; // definite assignment
}