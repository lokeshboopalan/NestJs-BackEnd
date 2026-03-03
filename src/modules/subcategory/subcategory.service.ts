import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subcategory.entity';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(createDto: CreateSubCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id: createDto.categoryId } });
    if (!category) throw new BadRequestException('Category not found');

    const subCategory = this.subCategoryRepo.create(createDto);
    return this.subCategoryRepo.save(subCategory);
  }

  async findAll() {
    return this.subCategoryRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const subCategory = await this.subCategoryRepo.findOne({ where: { id } });
    if (!subCategory) throw new NotFoundException('SubCategory not found');
    return subCategory;
  }

  async update(id: number, updateDto: UpdateSubCategoryDto) {
    const subCategory = await this.findOne(id);

    if (updateDto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: updateDto.categoryId } });
      if (!category) throw new BadRequestException('Category not found');
    }

    Object.assign(subCategory, updateDto);
    return this.subCategoryRepo.save(subCategory);
  }

  async remove(id: number) {
    const subCategory = await this.findOne(id);
    await this.subCategoryRepo.remove(subCategory);
    return { message: 'SubCategory deleted successfully' };
  }
}