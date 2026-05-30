import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity("product_price_history")
export class productPriceHistory {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    oldPrice!: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    newPrice!: number

    @CreateDateColumn()
    ChangedAt!: Date;

   @ManyToOne( () =>  Product, product => product.priceHistory, { onDelete: 'CASCADE' },)

   @JoinColumn({name: 'product_id'})
   product!: Product;

}
