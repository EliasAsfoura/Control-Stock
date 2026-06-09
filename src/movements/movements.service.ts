import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movement, MovementType } from './entities/movement.entity';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { MovementFiltersDTO } from './dto/filterAll-movement.dto';

@Injectable()
export class MovementsService {
  constructor(

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Movement)
    private movementRepo: Repository<Movement>,

  ) { }

  async create(dto: CreateMovementDto) {
    const product = await this.productRepo.findOneBy({ id: dto.productId });

    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }

    if (dto.type === MovementType.OUT) {
      if (product.stock < dto.quantity) {
        throw new HttpException('Stock insuficiente', HttpStatus.BAD_REQUEST)
      }
      product.stock -= dto.quantity;

    }

    if (dto.type === MovementType.IN) {
      product.stock += dto.quantity;
    }

    await this.productRepo.save(product);

    const movement = this.movementRepo.create({
      ...dto,
      product,
    });

    return this.movementRepo.save(movement);

  }

  async findAll(filters: MovementFiltersDTO): Promise<{ data: Movement[], total: number }> {

    const where: FindOptionsWhere<Movement> = {};

    if (filters.id !== 0 && filters.id !== undefined) {
      where.id = filters.id;
    }

    if (filters.productId) {
      where.product = { id: filters.productId };
    }

    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.clienteName) {
      where.clienteName = ILike(`%${filters.clienteName}%`)
    }
    if (filters.dateFrom || filters.dateTo) {
      where.date = Between(
        filters.dateFrom ? new Date(filters.dateFrom) : new Date('1900-01-01'),
        filters.dateTo ? new Date(filters.dateTo) : new Date()
      );
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    const [data, total] = await this.movementRepo.findAndCount({
      where,
      order: {
        id: "ASC",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: number) {
    const movement = await this.movementRepo.findOneBy({ id });

    if (!movement) {
      throw new HttpException('Numero de Movimiento no encontrado', HttpStatus.NOT_FOUND);
    }

    return movement;
  }

  update(id: number, updateMovementDto: UpdateMovementDto) {
    return `This action updates a #${id} movement`;
  }

  async remove(id: number) {
    const movement = await this.movementRepo.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!movement) {
      throw new HttpException(
        'Movimiento no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const product = movement.product;

    if (movement.type === MovementType.IN) {
      product.stock -= movement.quantity;
    }

    if (movement.type === MovementType.OUT) {
      product.stock += movement.quantity;
    }

    await this.productRepo.save(product);

    await this.movementRepo.remove(movement);

    return {
      message: 'Movimiento eliminado correctamente',
    };
  }
}
