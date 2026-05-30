import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TipoDeProducto } from "../enums/enumTipoDeProducto";
import { productPriceHistory } from "./productPriceHistory.entity";

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ type: 'enum', enum: TipoDeProducto })
    tipo!: TipoDeProducto;

    @Column({ unique: true })
    sku?: string;

    @Column({ default: 0 })
    stock!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    precio!: number;

    @Column({ nullable: true })
    imagenUrl?: string;

    @ManyToOne(() => productPriceHistory, history => history.product,)
    priceHistory?: productPriceHistory[];

}
