import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { TipoDeProducto } from "../enums/enumTipoDeProducto";

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'enum', enum: TipoDeProducto })
    tipo: TipoDeProducto;

    @Column({ unique: true })
    sku: string;

    @Column({ default: 0 })
    stock: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    precio: number;

    @Column({ nullable: true })
    imagenUrl: string;

}
