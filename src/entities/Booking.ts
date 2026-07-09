import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from './User';
import { Vehicle } from './Vehicle';
import { Payment } from './Payment';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customer_id: number;
    
    @Column()
    vehicle_id: string;
    
    @Column()
    start_date: Date;
    
    @Column()
    end_date: Date;
    
    @Column('decimal')
    total_price: number;

    @Column({ default: 'pending' })
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'customer_id' })
    customer: User;
    
    @ManyToOne(() => Vehicle)
    @JoinColumn({ name: 'vehicle_id' })
    vehicle: Vehicle;

    @OneToMany(() => Payment, (payment) => payment.booking)
        payments: Payment[];
}