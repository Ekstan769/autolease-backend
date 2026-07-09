import { Request, Response } from 'express';
import { createVehicle, getVehicles, getVehiclesById, updateVehicle, deleteVehicle } from '../services/vehicle.service';

export const addVehicle = async (req: any, res: Response) => {
    try {
        const vehicle = await createVehicle(req.body, req.user.id);
        return res.status(201).json({ success: true, data: vehicle });
    }catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const listVehicle = async (req: Request, res: Response) => {
    try {
        const vehicles = await getVehicles();
        return res.status(200).json({ success: true, data: vehicles });
    }catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await getVehiclesById(Number(req.params.id));
        return res.status(200).json({ success: true, data: vehicle });
    }catch (error: any) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

export const editVehicle = async (req: any, res: Response) => {
    try {
        const vehicle = await updateVehicle(
            Number(req.params.id),
            req.body,
            req.user.id
        );
        return res.status(200).json({ success: true, data: vehicle });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const removeVehicle = async (req: any, res: Response) => {
    try {
        const result = await deleteVehicle(
            Number(req.params.id),
            req.user.id
        );
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
