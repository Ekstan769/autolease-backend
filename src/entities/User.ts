import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm";
import { Vehicle } from './Vehicle';
import { Booking } from './Booking';
import { Review } from './Review';
import { Wallet } from './Wallet';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;
    
    @Column()
    last_name: string;
    
    @Column({ unique: true })
    email: string;
    
    @Column()
    password: string;
    
    @Column({ default: 'customer' })
    role: string;

    @Column({ default: false })
    is_verified: boolean;

    @Column({ default: false })
    is_suspended: boolean;

    @Column({ nullable: true })
    profile_picture: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
        vehicles: Vehicle[];

        @OneToMany(() => Booking, (booking) => booking.customer)
        bookings: Booking[];
        
        @OneToMany(() => Review, (review) => review.customer)
        reviews: Review[];
        
        @OneToOne(() => Wallet, (wallet) => wallet.owner)
        wallet: Wallet;
}
    