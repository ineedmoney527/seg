import { Router } from "express";
const router = Router();
import multer from "multer";
import {
  addBook,
  getISBN,
  readAllBook,
  deleteBook,
  deleteBooks,
  readUniqueBook,
  readSpecificBook,
  checkAvailable,
  readAllISBN,
} from "../controller/bookController.js";
router.get("/isbn", readAllISBN);
router.get("/checkAvailable/:isbn", checkAvailable);
router.get("/isbn/:id", getISBN);

router.get("/list", readUniqueBook);
router.get("/:id", readSpecificBook);
router.get("/", readAllBook);

router.post("/", addBook);
router.post("/:isbn", checkAvailable);
// // Route for updating a book by its ID
// router.put("/:id", updateBook);

// Route for deleting a book by its ID
router.delete("/rows/:ids", deleteBooks);
router.delete("/:id", deleteBook);

export default router;
