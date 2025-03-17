// agentRoutes.ts
import { Router, Request, Response } from "express";
import { getMockApiData, getMockResponse } from "../controllers/MockController";

const router = Router();

router.post("/mock-ai-status", async (req: Request, res: Response) => {
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

