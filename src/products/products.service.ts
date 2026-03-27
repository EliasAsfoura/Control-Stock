import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoDeProducto } from './enums/enumTipoDeProducto';
import { Movement } from 'src/movements/entities/movement.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Movement)
    private movementRepository: Repository<Movement>,
  ) { }

  private generateSku(nombre: string, tipo: string): string {
    const tipoCode = tipo.substring(0, 3).toUpperCase();
    const nombreCode = nombre.substring(0, 3).toUpperCase();
    const random = Math.floor(10000 + Math.random() * 90000); // más rango

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
    const product = await this.productsRepository.findOneBy({ id })

    if (!product) {
      throw new HttpException(`Producto con id ${id} no encontrado`, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async findByType(tipo: TipoDeProducto) {
    const products = await this.productsRepository.findBy({ tipo })

    if (products.length === 0) {
      throw new HttpException('No hay productos de este tipo', HttpStatus.NOT_FOUND);
    }

    return products;
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

    const product = await this.productsRepository.findOneBy({id})

    if (!product) {
      throw new HttpException(`Producto con id ${id} no encontrado`, HttpStatus.NOT_FOUND);
    }

    const count = await this.movementRepository.count({
      where: { product: { id } },
    });

    if (count > 0) {
      throw new HttpException(
        'No se puede eliminar el producto porque tiene movimientos asociados',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.productsRepository.delete(id);

    return {message: `${product.nombre} eliminado correctamente`}

  }

}
