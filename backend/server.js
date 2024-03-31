import express from "express";
import cors from "cors";
import userRoute from "./route/user.js";
import bookInfoRoute from "./route/bookInfo.js";
import bookRoute from "./route/book.js";
import adminRoute from "./route/admin.js";
import bodyParser from "body-parser";
import authMiddleware from "./middleware/authentication.js";
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
app.use("/api/book", bookRoute);
app.use("/admin", adminRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
