import { Router } from "express";
const router = Router();
import multer from "multer";
import express from "express";
import xlsx from "xlsx";
import mysql from "mysql";
import connection from "../config/dbConnection.js";
import axios from "axios";
// Configure multer to handle file uploads
const upload = multer({ dest: "uploads/" });
import {
  addBook,
  getISBN,
  readAllBooks, // with rating
  readInventory, // without rating
  readAvailableBooks,
  deleteBook,
  deleteBooks,
  readUniqueBook,
  readSpecificBook,
  checkAvailable,
  readAllISBN,
  readAllGenre,
  selectBook,
  readAllBookCode,
  updateStatus,
  rateBook,
  calculateAverageRating,
  advancedSearchBooks,
} from "../controller/bookController.js";

router.get("/isbn", readAllISBN);
router.get("/genre", readAllGenre);
router.get("/checkAvailable/:isbn", checkAvailable);
router.get("/isbn/:id", getISBN);
router.get("/bookCodes/:isbn", readAllBookCode);
router.get("/rating/:isbn", calculateAverageRating);
router.get("/list", readUniqueBook);
router.get("/inventory", readInventory);
router.get("/bookInventory", readInventory);
router.get("/", readAllBooks);
router.get("/searching/:search", advancedSearchBooks);
router.get("/available", readAvailableBooks);

router.post("/", addBook);
router.post("/rating", rateBook);
router.post("/upload", upload.single("excelFile"), async (req, res) => {
  try {
    // Load the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert Excel data to JSON format
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    console.log("JSON data:", jsonData);
    // Insert each row into the SQL database

    connection.beginTransaction();

    for (const row of jsonData) {
      const {
        isbn,
        title,
        author,
        edition,
        country,
        publisher,
        publishedYear,
        pages,
        price,
        location,
        descriptions,
        status,
        fileName,
        callNumber,
      } = row;
      row.edit = false;
      row.code = "whatever";
      // Send a POST request with the data to another server or API
      try {
        console.log("row" + row);
        const response = await axios.post(
          "http://localhost:5000/api/book",
          row
        );
        console.log("Response from API:", response.data.data);
      } catch (error) {
        console.error("Error sending POST request:", error.message);
      }
    }
    await connection.commit();
    res.status(200).send("File uploaded and data inserted into database");
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("Error processing file");
  }
});
router.post("/:isbn", checkAvailable);
// // Route for updating a book by its ID
// router.put("/:id", updateBook);

// Route for deleting a book by its ID
router.delete("/rows/:ids", deleteBooks);
router.delete("/:id", deleteBook);

router.put("/status", updateStatus);
router.get("/:isbn", selectBook);
router.get("/:id", readSpecificBook);
// Define a route to handle file upload
// Define a route to handle file upload

export default router;
