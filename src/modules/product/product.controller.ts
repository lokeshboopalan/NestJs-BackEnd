import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { cloudinaryStorage } from './upload/multer.config'; // your Cloudinary storage
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: cloudinaryStorage, // Cloudinary storage
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // 1️⃣ Check if product name already exists
    const existing = await this.productService.findByName(body.name);
    if (existing) {
      throw new BadRequestException(
        `Product name "${body.name}" already exists`,
      );
    }

    // 2️⃣ Parse variants safely
    let variants = [];
    if (body.variants) {
      variants =
        typeof body.variants === 'string'
          ? JSON.parse(body.variants)
          : body.variants;
    }

    // 3️⃣ Build DTO
    const dto: CreateProductDto = {
      ...body,
      categoryId: Number(body.categoryId),
      subCategoryId: Number(body.subCategoryId),
      variants,
      images: files?.map((file) => file.path) || [], // Cloudinary URLs
    };

    console.log(dto, 'Product DTO with Cloudinary URLs');

    // 4️⃣ Create product
    return this.productService.create(dto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: cloudinaryStorage,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(
      'Update route hit',
      id,
      body,
      files?.map((f) => f.path),
    );

    // 1️⃣ Parse variants safely
    let variants = [];
    if (body.variants) {
      variants =
        typeof body.variants === 'string'
          ? JSON.parse(body.variants)
          : body.variants;
    }

    // 2️⃣ Build DTO
    const dto: UpdateProductDto = {
      ...body,
      categoryId: Number(body.categoryId),
      subCategoryId: Number(body.subCategoryId),
      variants,
      images: files?.map((file) => file.path) || [],
    };

    console.log('Update DTO', dto);

    // 3️⃣ Call service
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
