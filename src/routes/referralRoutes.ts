import { Router } from "express";
import { stubController } from "../controllers/stubController";
import { createReferralLink, getReferralStats, listInvitees, registerStudent, showRegistrationForm } from "../controllers/referralController";

const referralRoutes = Router();

// Referral link generation
referralRoutes.post('/generate-referral-link', createReferralLink);

// Show registration form
referralRoutes.get('/register', showRegistrationForm);

// Student registration
referralRoutes.post('/register', registerStudent);

// List all invitees
referralRoutes.get('/invitees', listInvitees);

// Payment processing
referralRoutes.post('/payment', stubController('processPayment'));

// Getting statistics on invited students
referralRoutes.get('/stats', getReferralStats);

export default referralRoutes;