import { Router } from "express";
const router = Router();
import multer from "multer";
import {
  addBook,
  getISBN,
  readAllBooks,
  readAvailableBooks,
  deleteBook,
  deleteBooks,
  readUniqueBook,
  readSpecificBook,
  checkAvailable,
  readAllISBN,
  selectBook,
  readAllBookCode,
  updateStatus,
  rateBook,
  calculateAverageRating,
  advancedSearchBooks,
} from "../controller/bookController.js";

router.get("/isbn", readAllISBN);
router.get("/checkAvailable/:isbn", checkAvailable);
router.get("/isbn/:id", getISBN);
router.get("/bookCodes/:isbn", readAllBookCode);
router.get("/rating/:isbn", calculateAverageRating);
router.get("/list", readUniqueBook);

router.get("/", readAllBooks);
router.get("/searching/:search", advancedSearchBooks);
router.get("/available", readAvailableBooks);
router.post("/", addBook);
router.post("/rating", rateBook);

router.post("/:isbn", checkAvailable);
// // Route for updating a book by its ID
// router.put("/:id", updateBook);

// Route for deleting a book by its ID
router.delete("/rows/:ids", deleteBooks);
router.delete("/:id", deleteBook);

router.put("/status", updateStatus);
router.get("/:isbn", selectBook);
router.get("/:id", readSpecificBook);

export default router;
