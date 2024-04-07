import { Router } from "express";
const router = Router();

import {
  insertBorrowRecords,
  getBorrowRecords,
  getOverdueRecords,
  getReturnedRecords,
  updateReturnRecords,
  updateLostRecords,
  getBorrowRecordsById,
  getLostRecords,
  getBorrowCounts,
  getLoan,
  getRatingCount,
  hasRated,
  getReviews,
  getReviewsByBook,
  setReminderToYes,
} from "../controller/historyController.js";

router.post("/borrow", insertBorrowRecords);

router.get("/borrow/:userId", getBorrowRecordsById);
router.get("/borrow", getBorrowRecords);
router.get("/borrowcount/:userId", getBorrowCounts);
router.get("/loan/:userId", getLoan);
router.get("/rating/:userId", getRatingCount);
router.get("/reviewByBook/:isbn", getReviewsByBook);
router.get("/review/:userId", getReviews);
router.get("/hasRated/:userId/:isbn", hasRated);
router.get("/overdue", getOverdueRecords);

router.put("/return", updateReturnRecords);
router.get("/returned", getReturnedRecords);

router.put("/lost", updateLostRecords);
router.get("/lost", getLostRecords);
router.put("/sendEmail", setReminderToYes);

export default router;
