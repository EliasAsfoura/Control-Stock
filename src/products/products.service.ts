import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  private generateSku(nombre: string, tipo: string): string {
    const tipoCode = tipo.substring(0, 3).toUpperCase();
    const nombreCode = nombre.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `${tipoCode}-${nombreCode}-${random}`;
  }


  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      ...createProductDto,
      sku: this.generateSku(
        createProductDto.nombre,
        createProductDto.tipo,
      ),
    });

    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find()
  }

  async findById(id: number) {
    const product = this.productsRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException(`Producto con id ${id} no encontrado`, HttpStatus.NOT_FOUND)
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new HttpException(`Producto con id ${id} no encontrado`, HttpStatus.NOT_FOUND);
    }

    const updated = this.productsRepository.merge(product, dto);
    return this.productsRepository.save(updated);
  }


  async remove(id: number) {
    const result = this.productsRepository.delete(id)

    if (!result) {
      throw new HttpException(`Producto con id ${id} no encontrado`, HttpStatus.NOT_FOUND)
    }
  }
}


