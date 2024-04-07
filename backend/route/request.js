import { Router } from "express";
const router = Router();
import {
  getBookRequest,
  addBookRequest,
  pendingRequest,
  manageRequest,
  requestHistory,
  getBookRequestbyId,
} from "../controller/requestController.js";
router.get("/", getBookRequest);

router.get("/pending", pendingRequest);
router.get("/history", requestHistory);
router.get("/:id", getBookRequestbyId);
router.post("/add", addBookRequest);
router.put("/:ids", manageRequest);

export default router;
