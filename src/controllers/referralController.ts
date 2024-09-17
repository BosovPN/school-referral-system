// src/controllers/referralController.ts
import { Request, Response } from "express";
import * as referralService from "../services/referralService";

export const createReferralLink = async (req: Request, res: Response) => {
    try {
        const { referrerId } = req.body;

        if (!referrerId) {
            return res.status(400).json({ error: 'Referrer ID is required' });
        }

        const referralCode = await referralService.createReferral(referrerId);
        const referralLink = `${req.protocol}://${req.get('host')}/api/register?ref=${referralCode}`;

        return res.status(201).json({ referralLink });
    } catch (error: any) {
        console.error('Create referral link error occurred', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message || 'Unknown error',
        });
    }
};

export const getReferralStats = async (req: Request, res: Response) => {
    try {
        const stats = await referralService.getReferralStats();
        return res.status(200).json(stats);
    } catch (error: any) {
        console.error('Error fetching referral statistics', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message || 'Unknown error',
        });
    }
};
