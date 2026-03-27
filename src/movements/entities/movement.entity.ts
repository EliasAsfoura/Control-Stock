import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity()
export class Movement {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: MovementType,
    })
    type: MovementType;

    @Column({ nullable: true })
    clienteName: string;

    @Column()
    quantity: number;

    @CreateDateColumn()
    date: Date;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

}
