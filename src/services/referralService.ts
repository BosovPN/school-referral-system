import db from "../db";
import { v4 as uuidv4 } from 'uuid';

export const createReferral = async (referrerId: number) => {
    // Check if referrer exists
    const referrer = await db('users').where('id', referrerId).first();
    if (!referrer) {
        throw new Error('Referrer not found');
    }

    // Generate the referral code
    const referralCode = uuidv4();

    // Save referral code to database
    await db('referrals').insert({
        referrer_id: referrerId,
        referral_code: referralCode,
    });

    return referralCode;
};

export const getReferralInfo = async (referralCode: string) => {
    const referralInfo = await db('referrals').where('referral_code', referralCode).first();
    if (!referralInfo) {
        throw new Error('Invalid referral code');
    }
    return referralInfo;
};

export const getReferralStats = async () => {
    return await db('statistics')
        .join('users', 'statistics.referrer_id', '=', 'users.id')
        .select('users.name', 'users.email', 'statistics.total_invites')
        .orderBy('total_invites', 'desc');
};
