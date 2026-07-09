import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from './User';
import { Booking } from './Booking';
import { Review } from './Review';

@Entity('vehicles')
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner_id: number;
    
    @Column()
    brand: string;
    
    @Column()
    model: string;
    
    @Column()
    year: number;
    
    @Column({ unique: true })
    vin: string;

    @Column()
    engine_type: string;

    @Column()
    fuel_type: string;

    @Column()
    transmission: string;
    
    @Column('decimal')
    daily_price: number;

    @Column({ nullable: true })
    description: string;
    
    @Column({ nullable: true })
    address: string;
    
    @Column({ default: true })
    is_available: boolean;
    
    @Column({ default: false })
    is_suspended: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @OneToMany(() => Booking, (booking) => booking.vehicle)
        bookings: Booking[];

        @OneToMany(() => Review, (review) => review.vehicle)
        reviews: Review[];
}