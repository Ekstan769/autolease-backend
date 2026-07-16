import { Request, Response } from 'express';
import { createReview, getVehicleReviews, updateReview, deleteReview } from '../services/review.service';

export const addReview = async (req: any, res: Response) => {
    try {
        const review = await createReview(req.body, req.user.id);
        return res.status(201).json({ success: true, data: review });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getReviews = async (req: Request, res: Response) => {
    try {
        const result = await getVehicleReviews(Number(req.params.vehicleId));
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const editReview = async (req: any, res: Response) => {
    try {
        const review = await updateReview(
            Number(req.params.id),
            req.body,
            req.user.id
        );
        return res.status(200).json({ success: true, data: review });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const removeReviews = async (req: any, res: Response) => {
    try {
        const result = await deleteReview(
            Number(req.params.id),
            req.user.id
        );
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};