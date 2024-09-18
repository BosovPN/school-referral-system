// src/controllers/registrationController.ts
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as referralService from "../services/referralService";
import * as userService from "../services/userService";
import * as lessonService from "../services/lessonService";
import * as inviteeService from "../services/inviteeService";


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { token } = await userService.loginUser(email, password);
        res.json({ token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};


export const registerStudent = [
    body('surname').notEmpty().withMessage('Surname is required'),
    body('name').notEmpty().withMessage('Fullname is required'),
    body('phone').matches(/^\+?[78]\d{10}$/).withMessage('Valid phone number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character'),
    body('referral_code').notEmpty().withMessage('Referral code is required'),

    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        try {
            const { surname, name, patronymic, phone, email, password, referral_code } = req.body;

            // Check if referral link exists
            const referralInfo = await referralService.getReferralInfo(referral_code);

            // Register user
            const studentId = await userService.createUser({
                surname,
                name,
                patronymic,
                phone,
                email,
                password
            });

            // Track the referral in invitees table
            await inviteeService.addInvitee(referralInfo.id, studentId);

            // Track the referral statistics
            await referralService.updateReferralStats(referralInfo.referrer_id);

            // Add lessons for both referrer and invitee
            await lessonService.addLessonsForUsers(referralInfo.referrer_id, studentId);

            return res.status(201).json({ message: 'Student registered successfully', studentId })
        } catch (error: any) {
            console.error('Error registering student', error);
            return res.status(500).json({
                message: 'Server error',
                error: error.message || 'Unknown error',
            });
        }
    }
];

export const showRegistrationForm = (req: Request, res: Response) => {
    const referralCode = req.query.ref as string;
    if (!referralCode) {
        return res.status(400).json({ error: 'Referral code is required' });
    }
    res.render('register', { referralCode });
};