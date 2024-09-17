import { Router } from "express";
import { createReferralLink, getReferralStats } from "../controllers/referralController";
import { showRegistrationForm } from "../controllers/registrationFormController";
import { registerStudent } from "../controllers/registrationController";
import { listInvitees } from "../controllers/inviteeController";
import { createPayment, getAllPayments } from "../controllers/paymentController";

const referralRoutes = Router();

// Referral link generation
referralRoutes.post('/generate-referral-link', createReferralLink);

// Show registration form
referralRoutes.get('/register', showRegistrationForm);

// Student registration
referralRoutes.post('/register', registerStudent);

// List all invitees
referralRoutes.get('/invitees', listInvitees);

// Get payments info
referralRoutes.get('/payments', getAllPayments);

// Payment processing
referralRoutes.post('/payments', createPayment);

// Getting statistics on invited students
referralRoutes.get('/stats', getReferralStats);

export default referralRoutes;