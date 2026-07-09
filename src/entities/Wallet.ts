import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from './User';
import { WalletTransaction } from './WalletTransaction';

@Entity('wallets')
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner_id: number;
    
    @Column('decimal', { default: 0 })
    pending_balance: number;
    
    @Column('decimal', { default: 0 })
    available_balance: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @OneToMany(() => WalletTransaction, (wt) => wt.wallet)
        transactions: WalletTransaction[];
}