import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Vehicle } from '../entities/Vehicle';
import { Booking } from '../entities/Booking';
import { Payment } from '../entities/Payment';
import { Wallet } from '../entities/Wallet';
import { WalletTransaction } from '../entities/WalletTransaction';
import { Review } from '../entities/Review';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    entities: [User, Vehicle, Booking, Payment, Wallet, WalletTransaction, Review],
    migrations: [__dirname + '/../database/migrations/**/*.js'],
});