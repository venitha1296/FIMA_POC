// agentRoutes.ts
//@ts-ignore
import { Router } from "express";
import { fetchCountries, upsertCountries, insertCountry, fetchAgentsWithPagination, sendAgentRequest, deleteAgent } from "../controllers/AgentController";

const router = Router();

router.get("/insertCountries", upsertCountries);

router.get("/countries", fetchCountries);

router.post("/country", insertCountry);

router.get("/", fetchAgentsWithPagination);

router.post("/", sendAgentRequest);

router.delete("/:id", deleteAgent);

module.exports = router;

