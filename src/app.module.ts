import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/email/email.module';
import { CategoryModule } from './modules/category/category.module';
import { SubCategoryModule } from './modules/subcategory/subcategory.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { SliderModule } from './modules/slider/slider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    DatabaseModule,
    EmailModule,
    AuthModule,
    UserModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule,
    OrderModule,
    SliderModule,
  ],
})
export class AppModule {}
