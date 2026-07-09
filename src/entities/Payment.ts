import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Booking } from './Booking';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    booking_id: number;
    
    @Column('decimal')
    amount: number;
    
    @Column({ default: 'pending' })
    status: string;
    
    @Column({ unique: true, nullable: true })
    payment_reference: string;
    
    @Column()
    payment_gateway: string;

    @Column({ nullable:true })
    paid_at: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    
    @ManyToOne(() => Booking, (booking) => booking.payments)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;
}