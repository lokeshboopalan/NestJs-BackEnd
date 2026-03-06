import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/sliders',
        filename: (req, file, cb) => {
          const fileName = Date.now() + '-' + file.originalname;
          cb(null, fileName);
        },
      }),
    }),
  )
  create(
    // console.log('createSliderDto', createSliderDto)
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.sliderService.create(createSliderDto, file.path);
  }

  @Get()
  findAll() {
    return this.sliderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.sliderService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: number, @Body() updateSliderDto: UpdateSliderDto) {
    return this.sliderService.update(id, updateSliderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.sliderService.remove(id);
  }
}
