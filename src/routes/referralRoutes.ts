import { Router } from "express";
import { createReferralLink, getReferralStats } from "../controllers/referralController";
import { loginUser, registerStudent, showRegistrationForm } from "../controllers/userController";
import { listInvitees } from "../controllers/inviteeController";
import { createPayment, getAllPayments } from "../controllers/paymentController";
import { verifyToken } from "../middleware/jwtMiddleware";

const referralRoutes = Router();

// Login user
referralRoutes.post('/login', loginUser);

// Referral link generation
referralRoutes.post('/generate-referral-link', verifyToken, createReferralLink);

// Show registration form
referralRoutes.get('/register', showRegistrationForm);

// Student registration
referralRoutes.post('/register', registerStudent);

// List all invitees
referralRoutes.get('/invitees', verifyToken, listInvitees);

// Get payments info
referralRoutes.get('/payments', verifyToken, getAllPayments);

// Payment processing
referralRoutes.post('/payments', verifyToken, createPayment);

// Getting statistics on invited students
referralRoutes.get('/stats', verifyToken, getReferralStats);

export default referralRoutes;