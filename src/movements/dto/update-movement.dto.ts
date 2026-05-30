import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMovementDto } from './create-movement.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMovementDto extends PartialType(CreateMovementDto) {

    @ApiProperty({ example: 10 })
    @IsNumber()
    @IsOptional()
    quantity?: number;

    @ApiProperty({ example: "Juan Carlo" })
    @IsOptional()
    @IsString()
    clienteName?: string;
}
