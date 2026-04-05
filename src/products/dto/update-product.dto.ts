import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    nombre?: string | undefined;

    @IsNumber()
    @IsOptional()
    stock?: number | undefined;

    @IsNumber()
    precio?: number | undefined;

}
