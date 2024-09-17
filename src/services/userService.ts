import db from "../db";
import bcrypt from 'bcrypt';

export const createUser = async (userData: {
    surname: string;
    name: string;
    phone: string;
    email: string;
    password: string;
}) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    return await db('users').insert({
        ...userData,
        password: hashedPassword,
    }).returning('id');
};

export const addInvitee = async (referralId: number, inviteeId: number) => {
    await db('invitees').insert({
        referral_id: referralId,
        invitee_id: inviteeId,
    });
};

export const updateReferralStats = async (referrerId: number) => {
    const stats = await db('statistics').where('referrer_id', referrerId).first();

    if (stats) {
        await db('statistics').where('referrer_id', referrerId).increment('total_invites', 1);
    } else {
        await db('statistics').insert({
            referrer_id: referrerId,
            total_invites: 1,
        });
    }
};
