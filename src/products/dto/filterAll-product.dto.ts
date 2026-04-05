import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { TipoDeProducto } from "../enums/enumTipoDeProducto"
import { Type } from "class-transformer";

export class ProductoFiltersDTO {

    @IsString()
    @IsOptional()
    nombre?: string;

    @IsOptional()
    @IsEnum(TipoDeProducto)
    tipo?: TipoDeProducto;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    stock?: number;

    page?: number;

    limit?: number;
}