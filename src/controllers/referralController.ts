import { Request, Response } from "express";
import db from "../db";
import { v4 as uuidv4 } from 'uuid';
import Joi from "joi";
import { body, validationResult } from "express-validator";
import { totalmem } from "os";


const referralSchema = Joi.object({
    referrerId: Joi.number().integer().required()
});

const lessonSchema = Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required()
});

export const createReferralLink = async (req: Request, res: Response) => {
    try {
        const { error } = referralSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { referrerId } = req.body;

        // Check if referrer exists
        const referrer = await db('users').where('id', referrerId).first();
        if (!referrer) {
            return res.status(404).json({ error: 'Referrer not found' });
        }

        // Generate the referral code
        const referralCode = uuidv4();

        // Save referral code to database
        await db('referrals').insert({
            referrer_id: referrerId,
            referral_code: referralCode,
        })

        // Construct the referral link (assuming base URL comes from req)
        const referralLink = `${req.protocol}://${req.get('host')}/api/register?ref=${referralCode}`;

        // Return the referral link to the user
        return res.status(201).json({ referralLink });
    } catch (error: any) {
        console.error('Create referral link error occurred', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message || 'Unknown error',
        });
    }
};

export const showRegistrationForm = (req: Request, res: Response) => {
    const referralCode = req.query.ref as string;
    if (!referralCode) {
        return res.status(400).json({ error: 'Referral code is required' });
    }
    res.render('register', { referralCode });
}

interface LessonUserMapping {
    lesson_id: number;
    user_id: number;
}

const addLessonsForUsers = async (referrerId: number, inviteeId: number) => {
    const lessonContents = [
        "Lesson 1: Introduction to the Course",
        "Lesson 2: Understanding Basics",
        "Lesson 3: Advanced Topics",
        "Lesson 4: Final Project"
    ];

    // Creating lessons in table lessons
    const lessonsIds = await db('lessons')
        .insert(lessonContents.map((title) => ({ title, content: `${title} content` })))
        .returning('id');

    const lessonUserMappings: LessonUserMapping[] = lessonsIds.flatMap((lesson: { id: number }) => [
        { lesson_id: lesson.id, user_id: referrerId },
        { lesson_id: lesson.id, user_id: inviteeId },
    ]);

    await db('lesson_user').insert(lessonUserMappings);
}

export const registerStudent = [
    body('surname').notEmpty().withMessage('Surname is required'),
    body('name').notEmpty().withMessage('Fullname is required'),
    body('phone').matches(/^\+?[78]\d{10}$/).withMessage('Valid phone number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('referral_code').notEmpty().withMessage('Referral code is required'),

    async (req: Request, res: Response) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        try {
            const { surname, name, phone, email, referral_code } = req.body;

            // Check if referral link exists
            const referralInfo = await db('referrals').where('referral_code', referral_code).first();
            if (!referralInfo) {
                return res.status(400).json({ error: 'Invalid referral code' });
            }

            //Student registration
            const [student] = await db('users').insert({
                surname,
                name,
                phone,
                email,
            }).returning('id');

            const studentId = student.id;

            // Track the referral in invitees table
            await db('invitees').insert({
                referral_id: referralInfo.id,
                invitee_id: studentId,
            });

            const referrerId = referralInfo.referrer_id;

            //Track the referral
            const stats = await db('statistics').where('referrer_id', referrerId).first();

            if (stats) {
                // Increment the total_invites for the existing referrer
                await db('statistics').where('referrer_id', referrerId).increment('total_invites', 1);
            } else {
                // Create a new statistics entry for the referrer
                await db('statistics').insert({
                    referrer_id: referrerId,
                    total_invites: 1,
                })
            }

            // Add lessons for both referrer and invitee
            await addLessonsForUsers(referrerId, studentId);

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

export const listInvitees = async (req: Request, res: Response) => {
    try {
        // Retrieve all invitees with their associated user information
        const invitees = await db('invitees')
            .join('users', 'invitees.invitee_id', '=', 'users.id')
            .select('invitees.id', 'invitees.referral_id', 'users.id as user_id', 'users.surname', 'users.name', 'users.email', 'users.phone');

        return res.status(200).json(invitees);
    } catch (error: any) {
        console.error('Error fetching invitees', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message || 'Unknown error',
        });
    }
}