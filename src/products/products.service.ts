import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { FindOptionsWhere, ILike,  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoDeProducto } from './enums/enumTipoDeProducto';
import { Movement } from 'src/movements/entities/movement.entity';
import { ProductoFiltersDTO } from './dto/filterAll-product.dto';

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

    const productEncontrado = await this.productsRepository.findOne({
      where: {
        nombre: createProductDto.nombre,
        tipo: createProductDto.tipo,
      },

    });

    if (productEncontrado) {
      throw new HttpException(`El producto ${productEncontrado.nombre} ya existe`, HttpStatus.BAD_REQUEST)
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      sku: this.generateSku(
        createProductDto.nombre,
        createProductDto.tipo,
      ),
    });

    return this.productsRepository.save(product);
  }

  async findAll(filters: ProductoFiltersDTO): Promise<{data : Product[], total: number}> {

    const where: FindOptionsWhere<Product> = {};

    if (filters.nombre) {
      where.nombre = ILike(`%${filters.nombre}%`);
    }

    if (filters.tipo) {
      where.tipo = filters.tipo
    }

    if (filters.stock !== undefined) {
      where.stock = filters.stock;
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;


    const [data, total] = await this.productsRepository.findAndCount({
      where,
      order: {
        id: "ASC",
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {data, total}
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

    const product = await this.productsRepository.findOneBy({ id })

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

    return { message: `${product.nombre} eliminado correctamente` }

  }

}
