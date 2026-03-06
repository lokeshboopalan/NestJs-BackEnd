import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Slider } from './entities/slider.entity';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class SliderService {
  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
  ) {}

  async create(createSliderDto: CreateSliderDto, imagePath: string) {
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'sliders',
    });

    const slider = this.sliderRepository.create({
      ...createSliderDto,
      image: uploadResult.secure_url,
    });

    console.log('slider', slider);

    return await this.sliderRepository.save(slider);
  }

  async findAll() {
    return await this.sliderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const slider = await this.sliderRepository.findOne({ where: { id } });

    if (!slider) {
      throw new NotFoundException('Slider not found');
    }

    return slider;
  }

  async update(id: number, updateSliderDto: UpdateSliderDto) {
    const slider = await this.findOne(id);

    Object.assign(slider, updateSliderDto);

    return await this.sliderRepository.save(slider);
  }

  async remove(id: number) {
    const slider = await this.findOne(id);

    return await this.sliderRepository.remove(slider);
  }
}
