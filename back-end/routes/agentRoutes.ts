// agentRoutes.ts
//@ts-ignore
import { Router } from "express";
import { fetchCountries, upsertCountries, insertCountry, fetchAgentsWithPagination, createAgent } from "../controllers/AgentController";

const router = Router();

router.get("/insertCountries", upsertCountries);

router.get("/countries", fetchCountries);

router.post("/country", insertCountry);

router.get("/", fetchAgentsWithPagination);

router.post("/", createAgent);

module.exports = router;

