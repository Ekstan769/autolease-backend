import { AppDataSource } from "../config/database";
import { Vehicle } from "../entities/Vehicle";

const vehicleRepository = AppDataSource.getRepository(Vehicle);

export const createVehicle = async (data: any, ownerId: number) => {
    const existing = await vehicleRepository.findOne({
        where: { vin: data.vin }
    });

    if (existing) {
        throw new Error('A vehicle with this VIN already exists');
    }

    const vehicle = vehicleRepository.create({
        ...data,
        owner_id: ownerId,
    });
    return await vehicleRepository.save(vehicle);
};

export const getVehicles = async () => {
    return await vehicleRepository.find({
        where: { is_available: true, is_suspended: false },
        order: { created_at: 'DESC' }
    });
};

export const getVehiclesById = async (id: number) => {
    const vehicle = await vehicleRepository.findOne({
        where: { id },
        relations: { owner: true }
    });
    if (!vehicle) {
        throw new Error('Vehicle not found');
    }
    return vehicle;
};

export const updateVehicle = async (id: number, data: any, ownerId: number) => {
    const vehicle = await vehicleRepository.findOne({
        where: { id, owner_id: ownerId }
    });
    if (!vehicle) {
        throw new Error('Vehicle not found or unauthorized')
    }
    Object.assign(vehicle,data);
    return await vehicleRepository.save(vehicle);
};

export const deleteVehicle = async (id: number, ownerId: number) => {
    const vehicle = await vehicleRepository.findOne({
        where: { id, owner_id: ownerId }
    });
    if (!vehicle) {
        throw new Error('Vehicle not found or unauthorized')
    }
    await vehicleRepository.remove(vehicle);
    return { message: 'Vehicle deleted successfully' };
};

