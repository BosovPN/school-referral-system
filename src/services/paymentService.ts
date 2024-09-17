import db from '../db';

export const createPayment = async (paymentData: {
  userId: number;
  amount: number;
  payment_intent_id: string;
}) => {
  try {
    const [payment] = await db('payments').insert(paymentData).returning('*');
    return payment;
  } catch (error) {
    console.error('Error creating payment record in DB: ', error);
    throw new Error('Error creating payment');
  }
};

export const getAllPayments = async () => {
  try {
    const payments = await db('payments').select('*');
    return payments;
  } catch (error) {
    console.error('Error fetching payments from DB: ', error);
    throw new Error('Error fetching payments');
  }
};
