import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Wallet } from './Wallet';

@Entity('wallet_transactions')
export class WalletTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    wallet_id: number;
    
    @Column('decimal')
    amount: number;
    
    @Column()
    type: string;
    
    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Wallet)
    @JoinColumn({ name: 'wallet_id' })
    wallet: Wallet;
}