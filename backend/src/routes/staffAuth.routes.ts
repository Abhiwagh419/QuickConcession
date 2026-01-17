import { Router } from "express";
import { staffLogin } from "../controllers/staffAuth.controller";

const router = Router();

router.post("/login", staffLogin);

export default router;
