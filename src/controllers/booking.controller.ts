import { Request, Response } from 'express';
import { createBooking, getCustomerBookings, getBookingById, cancelBooking } from '../services/booking.service';

export const makeBooking = async (req: any, res: Response) => {
    try {
        const bookings = await createBooking(req.body, req.user.id);
        return res.status(201).json({ success: true, data: bookings });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getMyBookings = async (req: any, res: Response) => {
    try {
        const bookings = await getCustomerBookings(req.user.id);
        return res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getBooking = async (req: any, res: Response) => {
    try {
        const bookings = await getBookingById(
            Number(req.params.id),
            req.user.id
        );
        return res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

export const cancelMyBooking = async (req: any, res: Response) => {
    try {
        const bookings = await cancelBooking(
            Number(req.params.id),
            req.user.id
        );
        return res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};