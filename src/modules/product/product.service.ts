import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductVariant) private variantRepo: Repository<ProductVariant>,
    @InjectRepository(ProductImage) private imageRepo: Repository<ProductImage>,
  ) {}

  /** CREATE PRODUCT */
  async create(dto: CreateProductDto) {
    // 1️⃣ Save main product
    const product = this.productRepo.create({
      name: dto.name,
      description: dto.description,
      categoryId: dto.categoryId,
      subCategoryId: dto.subCategoryId,
    });
    const savedProduct = await this.productRepo.save(product);

    // 2️⃣ Save variants
    if (dto.variants?.length) {
      const variants = dto.variants.map((v) =>
        this.variantRepo.create({ ...v, productId: savedProduct.id }),
      );
      await this.variantRepo.save(variants);
    }

    // 3️⃣ Save images
    if (dto.images?.length) {
      const images = dto.images.map((url) =>
        this.imageRepo.create({ url, productId: savedProduct.id }),
      );
      await this.imageRepo.save(images);
    }

    return this.findOne(savedProduct.id); // return full product with relations
  }

  /** FIND ALL PRODUCTS */
  async findAll() {
    return this.productRepo.find({
      relations: ['variants', 'images'],
      order: { createdAt: 'DESC' },
    });
  }

  /** FIND ONE PRODUCT */
  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['variants', 'images'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  /** UPDATE PRODUCT */
  async update(id: number, dto: UpdateProductDto) {

    const product = await this.findOne(id);

    // Update main fields
    product.name = dto.name ?? product.name;
    product.description = dto.description ?? product.description;
    product.categoryId = dto.categoryId ?? product.categoryId;
    product.subCategoryId = dto.subCategoryId ?? product.subCategoryId;
    await this.productRepo.save(product);

    // Update variants: remove old, add new
    if (dto.variants) {
      await this.variantRepo.delete({ productId: id });
      const variants = dto.variants.map((v) =>
        this.variantRepo.create({ ...v, productId: id }),
      );
      await this.variantRepo.save(variants);
    }

    // Update images: remove old from DB + Cloudinary
    if (dto.images) {
      const oldImages = await this.imageRepo.find({ where: { productId: id } });
      for (const img of oldImages) {
        // Extract public_id from Cloudinary URL
        const publicId = img.url.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`products/${publicId}`);
        }
      }
      await this.imageRepo.delete({ productId: id });

      // Save new images
      const images = dto.images.map((url) =>
        this.imageRepo.create({ url, productId: id }),
      );
      await this.imageRepo.save(images);
    }

    return this.findOne(id);
  }

  /** DELETE PRODUCT */
  async remove(id: number) {
    const product = await this.findOne(id);

    // Delete images from Cloudinary
    const images = await this.imageRepo.find({ where: { productId: id } });
    for (const img of images) {
      const publicId = img.url.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    }

    // Delete related variants + images
    await this.variantRepo.delete({ productId: id });
    await this.imageRepo.delete({ productId: id });

    // Delete product
    await this.productRepo.delete(id);

    return { message: 'Product deleted successfully' };
  }

  /** FIND BY NAME (for checking duplicates) */
  async findByName(name: string) {
    return this.productRepo.findOne({ where: { name } });
  }
}