// agentRoutes.ts
//@ts-ignore
import { Router } from "express";
import { getMockApiData, getMockResponse } from "../controllers/MockController";

const router = Router();



router.post("/mock-ai-status", getMockResponse);

router.get("/mock-ai-data", getMockApiData);

module.exports = router;

