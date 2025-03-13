// agentRoutes.ts
//@ts-ignore
import { Router } from "express";
import { fetchCountries, upsertCountries, insertCountry, fetchAgentsWithPagination } from "../controllers/AgentController";

const router = Router();

router.get("/insertCountries", upsertCountries);

router.get("/countries", fetchCountries);

router.post("/country", insertCountry);

router.get("/agents", fetchAgentsWithPagination);



module.exports = router;

