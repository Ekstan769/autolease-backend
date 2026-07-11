import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import * as jwt  from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (data: any) => {
    // Check if email already exists
    const existingUser = await userRepository.findOne({
        where: { email: data.email }
    });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create and save the user
    const user = userRepository.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'customer',
    });

    await userRepository.save(user);

    // Never return the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

export const loginUser = async (data: any) => {
    // Find user by email
    const user = await userRepository.findOne({
        where: { email: data.email }
    });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare password against stored hash
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT Token
    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn:  '1d' }
    );
    const { password, ...userWithoutPassword } =user;
    return { user: userWithoutPassword, token };
};