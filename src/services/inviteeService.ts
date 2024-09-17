import db from '../db';

export const getAllInvitees = async () => {
    try {
        const invitees = await db('invitees')
            .join('users', 'invitees.invitee_id', '=', 'users.id')
            .select('invitees.id', 'invitees.referral_id', 'users.id as user_id', 'users.surname', 'users.name', 'users.email', 'users.phone');
        return invitees;
    } catch (error: any) {
        console.error('Error fetching invitees', error);
        throw new Error('Failed to retrieve invitees');
    }
};