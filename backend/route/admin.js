import { Router } from "express";
const router = Router();
import authenticate from "../middleware/authentication.js";

router.get("/", authenticate);
export default router;
