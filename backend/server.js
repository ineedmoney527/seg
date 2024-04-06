import express from "express";
import cors from "cors";
import userRoute from "./route/user.js";
import bookInfoRoute from "./route/bookInfo.js";
import bookRoute from "./route/book.js";
import adminRoute from "./route/admin.js";
import reserveRoute from "./route/reserve.js";
import requestRoute from "./route/request.js";
import historyRoute from "./route/history.js";
import bodyParser from "body-parser";
import authMiddleware from "./middleware/authentication.js";
import pool from "./config/dbConnection.js";
const app = express();

// Enable CORS for all routes
app.use(cors());
// Configure body-parser for handling JSON and URL-encoded data with a limit of "10mb"
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Alternatively, you can use the built-in express.json() middleware (for Express 4.16.0 and above)
// app.use(express.json({ limit: "10mb" }));

// Register routes
app.use("/api/user", authMiddleware, userRoute);
app.use("/api/bookinfo", bookInfoRoute);
app.use("/api/reserve", reserveRoute);
app.use("/api/book", bookRoute);
app.use("/api/history", historyRoute);
app.use("/api/request", requestRoute);

app.get("/api/UserMainPage", (req, res) => {
  const sql = "SELECT image, title, description, author_id FROM isbn";

  // Execute the query
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }

    // Convert BLOB data to Base64 and send it to the client
    const booksWithBase64Images = result.map((book) => {
      return {
        ...book,
        image: Buffer.from(book.image, "binary").toString("base64"),
      };
    });

    // If the query is successful, return the result
    res.json({ success: true, books: booksWithBase64Images });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
