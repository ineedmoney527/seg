import { Router } from "express";
const router = Router();
import multer from "multer";
import {
  addBook,
  getISBN,
  readAllBook,
  deleteBook,
  deleteBooks,
  readSpecificBook,
} from "../controller/bookController.js";

router.get("/", readAllBook);
router.get("/:id", readSpecificBook);
router.get("/isbn/:id", getISBN);

router.post("/", addBook);

// // Route for updating a book by its ID
// router.put("/:id", updateBook);

// Route for deleting a book by its ID
router.delete("/rows/:ids", deleteBooks);
router.delete("/:id", deleteBook);

export default router;
