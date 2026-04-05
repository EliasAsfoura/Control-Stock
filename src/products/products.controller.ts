import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseEnumPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TipoDeProducto } from './enums/enumTipoDeProducto';
import { ProductoFiltersDTO } from './dto/filterAll-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() filters : ProductoFiltersDTO) {
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(+id);
  }

  @Get('tipo/:tipo')
  findByType(@Param('tipo', new ParseEnumPipe(TipoDeProducto)) tipo: TipoDeProducto) {
    return this.productsService.findByType(tipo)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
