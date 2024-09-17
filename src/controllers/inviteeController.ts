// src/controllers/inviteeController.ts
import { Request, Response } from "express";
import { getAllInvitees } from "../services/inviteeService";

export const listInvitees = async (req: Request, res: Response) => {
    try {
        const invitees = await getAllInvitees();
        return res.status(200).json(invitees);
    } catch (error: any) {
        console.error('Error fetching invitees', error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message || 'Unknown error',
        });
    }
};
