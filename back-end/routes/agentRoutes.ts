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
    checkAgentStatus,
    getAgentOutputById
} from "../controllers/AgentController";
import {
    agentRequestValidation,
    paginationValidation,
    deleteAgentValidation,
    otpValidation
} from '../middlewares/validationMiddleware';

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

router.get("/", paginationValidation, async (req: Request, res: Response) => {
    try {
        await fetchAgentsWithPagination(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/", agentRequestValidation, async (req: Request, res: Response) => {
    try {
        await sendAgentRequest(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete("/:id", deleteAgentValidation, async (req: Request, res: Response) => {
    try {
        await deleteAgent(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/otp/update", otpValidation, async (req: Request, res: Response) => {
    try {
        await receiveOTP(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check agent status
router.get("/status/:requestId", async (req: Request, res: Response) => {
    try {
        await checkAgentStatus(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/:requestId/output", async (req: Request, res: Response) => {
    try {
        await getAgentOutputById(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;

