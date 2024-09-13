import { Router } from "express";
import { stubController } from "../controllers/stubController";

const referralRoutes = Router();

// Referral link generation
referralRoutes.post('/generate-referral-link', stubController('generateReferralLink'));

// Student registration
referralRoutes.post('/register', stubController('registerStudent'));

// Payment processing
referralRoutes.post('/payment', stubController('processPayment'));

// Getting statistics on invited students
referralRoutes.get('/stats', stubController('getReferralStats'));

export default referralRoutes;