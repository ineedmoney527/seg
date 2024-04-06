import { Router } from "express";
const router = Router();
import {
  reserve,
  pendingReserve,
  manageReserves,
  reserveHistory,
  checkReservation,
  deleteReservation,
  checkPending,
  handleIssue,
} from "../controller/reserveController.js";
router.post("/", reserve);
router.get("/pending", pendingReserve);
router.get("/checkPending/:isbn/:user_id", checkPending);
router.get("/history", reserveHistory);
router.get("/checkReservation/:isbn/:user_id", checkReservation);
router.put("/status", handleIssue);
router.put("/:ids", manageReserves);

router.delete("/:bookCodes/:user_id", deleteReservation);
export default router;
