import { Request, Response } from 'express';
import { initializePayment, verifyPayment } from '../services/payment.service';

export const initPayment = async (req: any, res: Response) => {
    try {
        const { booking_id } = req.body;
        const result = await initializePayment(
            Number(booking_id),
            req.user.id,
            req.user.email
        );
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const hash = require('crypto')
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(JSON.stringify(req.body))
            .digest('hex');
        
        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(401).json({ message: 'invalid signature' });
        }

        const { event, data } = req.body;

        if (event === 'charge.success') {
            await verifyPayment(data.reference);
        }
        return res.status(200).json({ received: true });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const confirmPayment = async (req: any, res: Response) => {
    try {
        const { reference } = req.params;
        const result = await verifyPayment(reference);
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};