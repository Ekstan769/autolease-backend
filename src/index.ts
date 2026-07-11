import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { version } from 'node:os';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import bookingRoutes from './routes/booking.routes';

dotenv.config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'AutoLease API is running',
        version: '1.0.0'
    });
});

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(async () => {
        await AppDataSource.runMigrations();
        console.log('Migrations ran successfully');
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);    
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });