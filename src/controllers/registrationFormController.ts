// src/controllers/registrationFormController.ts
import { Request, Response } from "express";

export const showRegistrationForm = (req: Request, res: Response) => {
    const referralCode = req.query.ref as string;
    if (!referralCode) {
        return res.status(400).json({ error: 'Referral code is required' });
    }
    res.render('register', { referralCode });
};
