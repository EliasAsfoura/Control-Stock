import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Movement } from 'src/movements/entities/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Movement])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
