import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { MovementType } from "../entities/movement.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMovementDto {
    @ApiProperty({
        enum: MovementType,
        example: MovementType.OUT
    })
    @IsEnum(MovementType)
    type!: MovementType;

    @ApiProperty({example: 10})
    @IsNumber()
    quantity!: number;

    @ApiProperty({example: 1})
    @IsNumber()
    productId!: number;

    @ApiProperty({example: "Juan Carlo"})
    @IsOptional()
    @IsString()
    clienteName!: string;
}
