// agentRoutes.ts
import { Router, Request, Response, RequestHandler } from "express";
import { getMockApiData, getMockResponse } from "../controllers/MockController";
import { body } from 'express-validator';
import { validate } from '../middlewares/validationMiddleware';

const router = Router();

const mockResponseValidation = [
    body('query').notEmpty().withMessage('Query is required'),
    validate
] as RequestHandler[];

router.post("/mock-ai-status", mockResponseValidation, async (req: Request, res: Response) => {
    try {
        await getMockResponse(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/mock-ai-data", async (req: Request, res: Response) => {
    try {
        await getMockApiData(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

