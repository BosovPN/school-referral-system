import db from "../db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

// Login function to authenticate user and generate JWT
export const loginUser = async (email: string, password: string) => {
    // Find the user by email
    const user = await db('users').where({ email }).first();

    if (!user) {
        throw new Error('User not found');
    }

    // Compare provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return { token };
}


export const createUser = async (userData: {
    surname: string;
    name: string;
    patronymic: string;
    phone: string;
    email: string;
    password: string;
}) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const [user] = await db('users').insert({
        ...userData,
        password: hashedPassword,
    }).returning('id');

    return user.id;
};
