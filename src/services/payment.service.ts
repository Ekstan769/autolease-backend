import { AppDataSource } from '../config/database';
import { Payment } from '../entities/Payment';
import { Booking } from '../entities/Booking';
import { Wallet } from '../entities/Wallet';
import { WalletTransaction } from '../entities/WalletTransaction';
import { Vehicle } from '../entities/Vehicle';

import axios from 'axios';

const paymentRepository = AppDataSource.getRepository(Payment);
const bookingRepository = AppDataSource.getRepository(Booking);
const walletRepository = AppDataSource.getRepository(Wallet);
const walletTransactionRepository = AppDataSource.getRepository(WalletTransaction);

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const initializePayment = async (bookingId: number, customerId: number, email: string) => {
    //find the booking
    const booking = await bookingRepository.findOne({ 
        where: { id: bookingId, customer_id: customerId } 
    });

    if (!booking) throw new Error('Booking not found');

    if (booking.status !== 'pending') {
        throw new Error('Booking is not in a payable state');
    }

    //convert to kobo (Paystack uses kobo, not naira)
    const amountInKobo = Number(booking.total_price) * 100;

    // Call Paystack initailize endpoint
    const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
            email,
            amount: amountInKobo,
            metadata: {
                booking_id: bookingId,
                customer_id: customerId
            }
        },
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    const { authorization_url, reference } = response.data.data;

    // create payment record
    const payment = paymentRepository.create({
        booking_id: bookingId,
        amount: booking.total_price,
        status: 'pending',
        payment_reference: reference,
        payment_gateway: 'paystack'
    });
    await paymentRepository.save(payment);

    // update booking status
    booking.status = 'awaiting_payment';
    await bookingRepository.save(booking);

    return { authorization_url, reference };
};

export const verifyPayment = async (reference: string) => {
    // Call Paystack verify endpoint
    const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        }
    );

    const { status, metadata, paid_at } = response.data.data;

    if (status !== 'success') {
        throw new Error('Payment verification failed');
    }

    // use a transaction to ensure consistency
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Update payment status
        const payment = await paymentRepository.findOne({ 
            where: { payment_reference: reference }
         });

        if (!payment) throw new Error('Payment record not found');

        payment.status = 'success';
        payment.paid_at = new Date(paid_at);
        await queryRunner.manager.save(payment);

        // Update booking status
        const booking = await bookingRepository.findOne({ 
            where: { id: metadata.booking_id } 
        });
        if (!booking) throw new Error('Booking not found');
        
        booking.status = 'paid';
        await queryRunner.manager.save(booking);

        const vehicle = await AppDataSource.getRepository(Vehicle).findOne({ 
            where: { id: Number(booking.vehicle_id) } 
        });

        if (!vehicle) throw new Error('Vehicle not found');

        // credit owner wallets
        let wallet = await walletRepository.findOne({ 
            where: { owner_id: Number(vehicle.owner_id) } 
        });

        // create wallet  if it does not exist
        if (!wallet) {
            wallet = walletRepository.create({
                owner_id: Number(vehicle.owner_id),
                pending_balance: 0,
                available_balance: 0
            });
        }

        // Deduct 10% commission
        const commission = Number(booking.total_price) * 0.10;
        const ownerEarning = Number(booking.total_price) - commission;

        wallet.pending_balance = Number(wallet.pending_balance) + ownerEarning;
        await queryRunner.manager.save(wallet);

        //log wallet transaction
        const transaction = walletTransactionRepository.create({
            wallet_id: wallet.id,
            amount: ownerEarning,
            type: 'credit',
            description: `Rental payment for booking #${booking.id} (10% commission deducted)`
        });
        
        await queryRunner.manager.save(transaction);

        await queryRunner.commitTransaction();
        return { message: 'Payment verified and wallet credited' };

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release()
    }
};