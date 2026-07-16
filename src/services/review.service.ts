import { AppDataSource } from '../config/database';
import { Review} from '../entities/Review';
import { Booking } from '../entities/Booking';

const reviewRepository = AppDataSource.getRepository(Review);
const bookingRepository = AppDataSource.getRepository(Booking);

export  const createReview = async (data: any, customerId: number) => {
    // Check 1: If customer has a complete booking for the vehicle
    const completedBooking = await bookingRepository.findOne({
        where: {
            customer_id: customerId,
            vehicle_id: data.vehicle_id,
            status: 'completed'
        }
    });
    if (!completedBooking) {
        throw new Error('You can only review vehicles you have completed a booking for');
    }
    // Check 2: This booking hasn't been reviewed 
    const existingReview = await reviewRepository.findOne({
        where: {
            customer_id: customerId,
            vehicle_id: data.vehicle_id
        }
    });
    if (existingReview) {
        throw new Error('You have already reviewed this vehicle');
    }
    // Check 3: Rating must be between 1 and 5
    if (data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }
    const review = reviewRepository.create({
        customer_id: customerId,
        vehicle_id: data.vehicle_id,
        rating: data.rating,
        comment: data.comment
    });
    return await reviewRepository.save(review);
};

export const getVehicleReviews = async (vehicleId: number) => {
    const reviews = await reviewRepository.find({
        where: { vehicle_id: vehicleId },
        relations: { customer: true },
        order: { created_at: 'DESC' }
    });
    // Claculate average rating and total count
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r .rating, 0) / totalReviews
        : 0;
    
    return {
        average_rating: Math.round(averageRating * 10) / 10,
        total_reviews: totalReviews,
        reviews
    };
};

export const updateReview = async (id: number, data: any, customerId: number) => {
    const review = await reviewRepository.findOne({
        where: { id, customer_id: customerId }
    });
    if (!review) throw new Error('Review not found or unauthorized');

    if (data.rating && (data.rating < 1 || data.rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
    }
    Object.assign(review, data);
    return await reviewRepository.save(review);
};

export const deleteReview = async (id: number, customerId: number) => {
    const review = await reviewRepository.findOne({
        where: { id, customer_id: customerId }
    });
    if (!review) throw new Error('Review not found or unauthorized');

    await reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
};