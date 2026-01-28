import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    nombre?: string | undefined;

    @IsNumber()
    stock?: number | undefined;

    @IsNumber()
    precio?: number | undefined;

}
