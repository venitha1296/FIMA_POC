// agentRoutes.ts
import { Router, Request, Response } from "express";
import { 
    fetchCountries, 
    upsertCountries, 
    insertCountry, 
    fetchAgentsWithPagination, 
    sendAgentRequest, 
    deleteAgent, 
    receiveOTP, 
    logAIResponse 
} from "../controllers/AgentController";

const router = Router();

router.get("/insertCountries", async (req: Request, res: Response) => {
    try {
        await upsertCountries(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/countries", async (req: Request, res: Response) => {
    try {
        await fetchCountries(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/country", async (req: Request, res: Response) => {
    try {
        await insertCountry(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        await fetchAgentsWithPagination(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        await sendAgentRequest(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        await deleteAgent(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/otp-update", async (req: Request, res: Response) => {
    try {
        await receiveOTP(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

