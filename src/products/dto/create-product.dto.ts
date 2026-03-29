import { IsNumber, IsString, IsEnum, Min, Max, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoDeProducto } from '../enums/enumTipoDeProducto';

export class CreateProductDto {
  @ApiProperty({ example: 'Teclado mecánico' })
  @IsString()
  nombre: string;

  @ApiProperty({
    enum: TipoDeProducto,
    example: TipoDeProducto.TECLADO,
  })
  @IsEnum(TipoDeProducto)
  tipo: TipoDeProducto;

  @ApiProperty({ example: 15000, minimum: 1 })
  @IsNumber()
  @Min(1)
  precio: number;

  @ApiProperty({ example: 'https://..../...webp'})
  @IsOptional()
  @IsString()
  @IsUrl()
  imagenUrl?: string
}
