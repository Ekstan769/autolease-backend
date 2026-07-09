import { AppDataSource } from "../config/database";
import { Booking } from "../entities/Booking";
import { Vehicle } from "../entities/Vehicle";

const bookingRepository = AppDataSource.getRepository(Booking);
const vehicleRepository = AppDataSource.getRepository(Vehicle);

export const createBooking = async (data: any, customerId: number) => {
    // Check if vehicle exists
    const vehicle = await vehicleRepository.findOne({
        where: { id: data.vehicle_id }
    });
    if (!vehicle) throw new Error('Vehicle not found');
    if (!vehicle.is_available) throw new Error('Vehicle is not available');
    if (vehicle.is_suspended) throw new Error('Vehicle is suspended');

    // Check customer is not the owner
    if (vehicle.owner_id === customerId) {
        throw new Error('You cannot book your own vehicle');
    }

    // Check fo overlapping bookings
    const overlapping = await bookingRepository
        .createQueryBuilder('booking')
        .where('booking.vehicle_id = :vehicleId', { vehicleId: data.vehicle_id })
        .andWhere('booking.status NOT IN (:...statuses)', {
            statuses: ['cancelled']
        })
        .andWhere(
            '(booking.start_date <= :endDate AND booking.end_date >= :startDate)',
            { startDate: data.start_date, endDate: data.end_date }
        )
        .getOne();

    if (overlapping) {
        throw new Error('Vehicle is already booked for these dates');
    }

    // Calculate total price
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    const days = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 1) throw new Error('End date must be after start date');

    const total_price = Number(vehicle.daily_price) * days;

    // Create booking
    const booking = bookingRepository.create({
        customer_id: customerId,
        vehicle_id: data.vehicle_id,
        start_date: start,
        end_date: end,
        total_price,
        status: 'pending'
    });
    return await bookingRepository.save(booking);
};

export const getCustomerBookings = async (customerId: number) => {
    return await bookingRepository.find({
        where: { customer_id: customerId },
        relations: { vehicle: true },
        order: { created_at: 'DESC' }
    });
};

export const getBookingById = async (id: number, customerId: number) => {
    const booking = await bookingRepository.findOne({
        where: { id, customer_id: customerId },
        relations: { vehicle: true }
    });
    if (!booking) throw new Error('Booking not found');
    return booking;
};

export const cancelBooking = async (id: number, customerId: number) => {
    const booking = await bookingRepository.findOne({
        where: { id, customer_id: customerId },
    });

    if (!booking) throw new Error('Booking not found');
    
    if (booking.status === 'completed') {
        throw new Error('Cannot cancel a completed booking');    
    }

    if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
    }
    booking.status = 'cancelled';
    return await bookingRepository.save(booking);
};