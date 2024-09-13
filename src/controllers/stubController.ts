import { Request, Response } from "express";

// Stub for all controllers
export const stubController = (controllerName: string) => {
    return (req: Request, res: Response) => {
        res.status(501).json({
            message: `${controllerName} is not implemented yet`,
            status: 501,
        });
    };
};