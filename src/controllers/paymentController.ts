import { Request, Response } from 'express';
import Stripe from 'stripe';
import * as paymentService from '../services/paymentService';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { userId, amount, currency, description } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: 'Amount and userId are required' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'rub',
      description: description || 'Default description',
    });

    // Save payment record in the database
    const payment = await paymentService.createPayment({
      userId,
      amount,
      payment_intent_id: paymentIntent.id,
    });

    return res.status(201).json(payment);
  } catch (error: any) {
    console.error('Error creating payment: ', error);
    return res.status(500).json({
      message: 'Server Payment error',
      error: error.message || 'Unknown error',
    });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getAllPayments();
    return res.status(200).json(payments);
  } catch (error: any) {
    console.error('Error fetching payments: ', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message || 'Unknown error',
    });
  }
};
