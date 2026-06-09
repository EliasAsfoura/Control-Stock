import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { MovementType } from "../entities/movement.entity";
import { Type } from "class-transformer";

export class MovementFiltersDTO {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number

    @IsEnum(MovementType)
    @IsOptional()
    type?: MovementType;

    @IsOptional()
    @IsString()
    clienteName?: string

    @IsOptional()
    @IsString()
    dateFrom?: string;

    @IsOptional()
    @IsString()
    dateTo?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    productId?: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;
}