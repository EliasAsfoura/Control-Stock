import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movement, MovementType } from './entities/movement.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

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

  findAll() {
    return this.movementRepo.find();
  }

  findOne(id: number) {
    const movement = this.movementRepo.findOneBy({id});

    if (!movement) {
      throw new HttpException('Numero de Movimiento no encontrado', HttpStatus.NOT_FOUND);
    }

    return movement;
  }

  update(id: number, updateMovementDto: UpdateMovementDto) {
    return `This action updates a #${id} movement`;
  }

  remove(id: number) {
    return `This action removes a #${id} movement`;
  }
}
