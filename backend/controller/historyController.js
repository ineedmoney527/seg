import connection from "../config/dbConnection.js";
import nodemailer from "nodemailer";
import moment from "moment";
const insertBorrowRecords = (req, res) => {
  const { bookCode, user_id } = req.body;
  const selectQuery =
    "SELECT book.book_code, isbn.title, author.name AS author, isbn.edition  FROM book  JOIN isbn ON book.isbn = isbn.isbn JOIN author on author.id=isbn.author_id WHERE book_code=" +
    bookCode;
  connection.query(selectQuery, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      res
        .status(500)
        .json({ error: "An error occurred while executing the query." });
    } else {
      const book_code = data[0].book_code;
      const title = data[0].title;
      const author = data[0].author;
      const edition = data[0].edition;
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 14);

      const insertQuery =
        "INSERT INTO borrowedrecord (user_id, book_code, start_date, end_date,status) VALUES (?, ?, ?, ?,?)";
      connection.query(
        insertQuery,
        [user_id, bookCode, now, tomorrow, "B"],
        (err, result) => {
          if (err) {
            console.error("Error inserting record:", err);
            res
              .status(500)
              .json({ error: "An error occurred while inserting the record." });
          } else {
            console.log("Record inserted successfully:", result);
            res.status(200).json({ message: "Record inserted successfully." });
          }
        }
      );
    }
  });
};

const getBorrowRecordsById = (req, res) => {
  const userId = req.params.userId;
  const query = `SELECT borrowedrecord.id, borrowedrecord.user_id, book.*, isbn.title, isbn.image,
    author.name AS author, isbn.edition, isbn.pages, isbn.publish_year, DATE_FORMAT(borrowedrecord.start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(borrowedrecord.end_date, '%Y-%m-%d') as end_date,
    DATEDIFF(borrowedrecord.end_date, borrowedrecord.start_date) AS days_remaining
  FROM borrowedrecord 
  JOIN book ON borrowedrecord.book_code = book.book_code 
  JOIN isbn ON book.isbn = isbn.isbn 
  JOIN author ON author.id = isbn.author_id WHERE (borrowedrecord.status="B" OR borrowedrecord.status="R") AND user_id=${userId}`;

  connection.query(query, (err, data) => res.json(err ? err : data));
};

const getBorrowCounts = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT COUNT(*) AS borrow_count
    FROM borrowedrecord
    WHERE user_id = ?
      AND status IN ('B', 'R')
  `;
  // Execute the SQL query with the user ID parameter
  connection.query(query, [userId], (err, data) => res.json(err ? err : data));
};

const getBorrowRecords = (req, res) => {
  const query = `SELECT borrowedrecord.id, borrowedrecord.user_id, book.book_code, isbn.title, 
    author.name AS author, isbn.edition, DATE_FORMAT(borrowedrecord.start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(borrowedrecord.end_date, '%Y-%m-%d') as end_date,
    DATEDIFF(borrowedrecord.end_date, borrowedrecord.start_date) AS days_remaining
  FROM borrowedrecord 
  JOIN book ON borrowedrecord.book_code = book.book_code 
  JOIN isbn ON book.isbn = isbn.isbn 
  JOIN author ON author.id = isbn.author_id WHERE borrowedrecord.status="B"`;

  connection.query(query, (err, data) => res.json(err ? err : data));
};

const getOverdueRecords = (req, res) => {
  const query = `SELECT 
  borrowedrecord.id, 
  borrowedrecord.user_id, 
  book.book_code, 
  isbn.title, 
  author.name AS author, 
  isbn.edition, 
  DATE_FORMAT(borrowedrecord.start_date, '%Y-%m-%d') AS start_date, 
  DATE_FORMAT(borrowedrecord.end_date, '%Y-%m-%d') AS end_date,
  DATEDIFF(NOW(), borrowedrecord.end_date) AS days_overdue,
  DATEDIFF(NOW(), borrowedrecord.end_date) * 5 AS fine,
  borrowedrecord.reminder
FROM 
  borrowedrecord 
JOIN 
  book ON borrowedrecord.book_code = book.book_code 
JOIN 
  isbn ON book.isbn = isbn.isbn 
JOIN 
  author ON author.id = isbn.author_id 
WHERE 
  borrowedrecord.status = 'B' 
  AND borrowedrecord.end_date < NOW();
`;

  connection.query(query, (err, data) => res.json(err ? err : data));
};

const updateReturnRecords = (req, res) => {
  const { id } = req.body; // Assuming the client sends an object with 'ids' key
  console.log(id); // Make sure you receive an array of IDs from the client
  const query = `UPDATE borrowedrecord SET status='R' , return_date = ? WHERE id IN (?)`;
  // Use a question mark (?) as a placeholder for the array of IDs
  connection.query(query, [new Date(), id], (err, data) =>
    res.json(err ? err : data)
  );
};

const updateLostRecords = (req, res) => {
  const { id } = req.body; // Assuming the client sends an object with 'ids' key
  console.log(id); // Make sure you receive an array of IDs from the client
  const query = `UPDATE borrowedrecord SET status='L' , return_date = ? WHERE id IN (?)`;
  // Use a question mark (?) as a placeholder for the array of IDs
  connection.query(query, [new Date(), id], (err, data) =>
    res.json(err ? err : data)
  );
};
const getReturnedRecords = (req, res) => {
  const query = `SELECT borrowedrecord.id, borrowedrecord.user_id, book.book_code, isbn.title, 
    author.name AS author, isbn.edition, DATE_FORMAT(borrowedrecord.start_date, '%Y-%m-%d') AS start_date, DATE_FORMAT(borrowedrecord.end_date, '%Y-%m-%d') as end_date,
    ABS(DATEDIFF(borrowedrecord.end_date, borrowedrecord.start_date)) AS days_borrowed,
    DATE_FORMAT(borrowedrecord.return_date, '%Y-%m-%d') AS return_date,
    CASE
        WHEN DATEDIFF(borrowedrecord.return_date, borrowedrecord.end_date) > 0 THEN DATEDIFF(borrowedrecord.return_date, borrowedrecord.end_date) * 5
        ELSE 0
    END AS fine
  FROM borrowedrecord 
  JOIN book ON borrowedrecord.book_code = book.book_code 
  JOIN isbn ON book.isbn = isbn.isbn 
  JOIN author ON author.id = isbn.author_id 
  WHERE borrowedrecord.status = "R"`;

  connection.query(query, (err, data) => res.json(err ? err : data));
};

const getLostRecords = (req, res) => {
  const query = `
  SELECT 
    borrowedrecord.id, 
    borrowedrecord.user_id, 
    book.book_code, 
    isbn.title, 
    author.name AS author, 
    isbn.edition, 
    DATE_FORMAT(borrowedrecord.start_date, '%Y-%m-%d') AS start_date, 
    DATE_FORMAT(borrowedrecord.end_date, '%Y-%m-%d') AS end_date,
    ABS(DATEDIFF(borrowedrecord.end_date, borrowedrecord.start_date)) AS days_borrowed,
    DATE_FORMAT(borrowedrecord.return_date, '%Y-%m-%d') AS return_date, 
    CASE 
      WHEN NOW() > borrowedrecord.end_date THEN (isbn.price + (DATEDIFF(NOW(), borrowedrecord.end_date) * 5))
      ELSE isbn.price
    END AS fine
  FROM borrowedrecord 
  JOIN book ON borrowedrecord.book_code = book.book_code 
  JOIN isbn ON book.isbn = isbn.isbn 
  JOIN author ON author.id = isbn.author_id 
  WHERE borrowedrecord.status = "L"`;

  connection.query(query, (err, data) => res.json(err ? err : data));
};
const getLoan = (req, res) => {
  const id = req.params.userId;
  const sqlQuery = `SELECT COUNT(*) AS count_borrowed
                  FROM borrowedrecord
                  WHERE (status = 'B' OR status='L') AND user_id = ?`;

  // Execute the SQL query with the user_id parameter
  connection.query(sqlQuery, [id], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return;
    }

    // Results will contain the count_borrowed value
    res.json({ data: results[0].count_borrowed });
  });
};

const getRatingCount = async (req, res) => {
  const id = req.params.userId;
  const query =
    "SELECT COUNT(*) AS numberOfRatings FROM bookrating WHERE user_id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return;
    }
    // Results will contain the count_borrowed value
    res.json({ data: results[0].numberOfRatings });
  });
};
const getReviews = async (req, res) => {
  const id = req.params.userId;
  const query = `SELECT b.rating, b.comments, i.isbn, i.image, i.title
    FROM bookrating b
    JOIN isbn i ON b.isbn = i.isbn
    WHERE b.user_id = ?;
    `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    // Results will contain the selected columns for the user's reviews
    res.json({ data: results });
  });
};
const getReviewsByBook = async (req, res) => {
  const id = req.params.isbn;
  const query = `
  SELECT
      b.user_id,
      u.image_file,
      u.name,
      b.rating,
      b.comments,
      i.isbn,
      i.image,
      i.title
  FROM
      bookrating b
  JOIN
      isbn i ON b.isbn = i.isbn
  JOIN
      user u ON u.id=b.user_id
  WHERE
      i.isbn = ?;
`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    // Results will contain the selected columns for the user's reviews
    res.json({ data: results });
  });
};

const hasRated = (req, res) => {
  const userId = req.params.userId; // Extract parameters from the query string
  const isbn = req.params.isbn;

  // Check if the user has rated the book with the given ISBN
  const sqlQuery = "SELECT * FROM bookrating WHERE user_id = ? AND isbn = ?";
  connection.query(sqlQuery, [userId, isbn], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // User has rated the book
      res.status(200).json({ rated: true });
    } else {
      // User has not rated the book
      res.status(200).json({ rated: false });
    }
  });
};

const setReminderToYes = async (req, res) => {
  const { id, user_id, title, fine, days_overdue } = req.body;
  console.log("borrow_id", id);
  console.log("userId", user_id);
  console.log("bookTitle", title);
  console.log("fine", fine);
  console.log("days_overdue", days_overdue);

  // Fetch the email associated with the provided user_id
  const emailQuery = "SELECT email FROM user WHERE id = ?";
  connection.query(emailQuery, [user_id], async (emailErr, emailResult) => {
    if (emailErr) {
      console.error("Error retrieving email:", emailErr);
      return res
        .status(500)
        .json({ message: "An error occurred while retrieving email." });
    }

    const email =
      emailResult && emailResult.length > 0 ? emailResult[0].email : null;

    if (email) {
      const updateQuery =
        "UPDATE borrowedrecord SET reminder = 'Y' WHERE id = ?";
      connection.query(updateQuery, [id], async (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error setting reminder to 'Y':", updateErr);
          return res.status(500).json({
            message: "An error occurred while setting reminder to 'Y'.",
          });
        }

        console.log("Reminder set to 'Y' for borrow ID:", id);
        sendOverdueReminder(id, email, title, fine, days_overdue);
        res
          .status(200)
          .json({ message: "Reminder set to 'Y' successfully.", email });
      });
    }
  });
};

const sendOverdueReminder = async (
  borrow_id,
  email,
  bookTitle,
  fine,
  days_overdue
) => {
  console.log("borrow_id", borrow_id);
  console.log("email", email);
  console.log("bookTitle", bookTitle);
  console.log("fine", fine);
  console.log("days_overdue", days_overdue);

  // Send email to user
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "library.soton.uk@gmail.com",
      pass: "mfcw pqpf ljsn cyya", // App password
    },
  });

  const mailOptions = {
    from: "library.soton.uk@gmail.com",
    to: email,
    subject: "Overdue Book Reminder",
    text: `Dear user,\n\nThis is a reminder that you have not returned the book.\n\n Book: ${bookTitle}\n\n OverdueDays: ${days_overdue}\n\n fine: ${fine}\n\nPlease return it as soon as possible to avoid fines.\n\nRegards,\nLibrary Team`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending overdue reminder email:", err);
    } else {
      console.log("Overdue reminder email sent to:", email);
    }
  });
};

// Call this function where needed in your application logic
// Route to handle fetching genre-wise book counts based on start and end dates
const getPieChart = async (req, res) => {
  try {
    const query = `
      SELECT genre.name, COUNT(book.isbn) AS count
      FROM book
      JOIN isbn ON book.isbn = isbn.isbn
      JOIN genre ON isbn.genre_id = genre.id
      GROUP BY genre.name;
    `;

    connection.query(query, (err, data) => {
      res.json(err ? err : data);
      console.log(data);
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};

const getBorrowedPieChart = async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log(startDate);
  console.log(endDate);
  try {
    const query = `
    SELECT genre.name, COUNT(book.isbn) AS count FROM borrowedrecord br JOIN book ON br.book_code = book.book_code JOIN isbn ON book.isbn = isbn.isbn JOIN genre ON isbn.genre_id = genre.id WHERE br.start_date >= ? AND br.end_date <= ? GROUP BY genre.name;
    `;

    connection.query(query, [startDate, endDate], (err, data) => {
      res.json(err ? err : data);
      console.log(data);
    });
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};

const getMonthlyBookCount = async (req, res) => {
  const query = `
SELECT 
  DATE_FORMAT(added_date, '%Y-%m') AS month,
  COUNT(*) AS monthly_count
FROM 
  book
GROUP BY 
  YEAR(added_date), 
  MONTH(added_date)
ORDER BY 
  YEAR(added_date) ASC, 
  MONTH(added_date) ASC;
`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching monthly count data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results);
  });
};
const getCumulativeBookCount = async (req, res) => {
  const twelveMonthsAgo = moment().subtract(12, "months").format("YYYY-MM-DD");

  const query = `
  SELECT 
  date_format(added_date, '%Y-%m') AS month,
  COUNT(*) AS monthly_count,
  (SELECT COUNT(*) FROM book b2 WHERE date_format(b2.added_date, '%Y-%m') <= date_format(b1.added_date, '%Y-%m')) AS cumulative_count
FROM 
  book b1
WHERE 
  added_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
GROUP BY 
  month
ORDER BY 
  month;

  `;
  connection.query(query, [twelveMonthsAgo], (err, results) => {
    if (err) {
      console.error("Error fetching cumulative count data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log(results);
    res.json(results);
  });
};
export {
  insertBorrowRecords,
  getBorrowRecords,
  getBorrowRecordsById,
  getOverdueRecords,
  getReturnedRecords,
  updateReturnRecords,
  updateLostRecords,
  getLostRecords,
  getBorrowCounts,
  getLoan,
  getRatingCount,
  hasRated,
  getReviewsByBook,
  getReviews,
  setReminderToYes,
  getPieChart,
  getBorrowedPieChart,
  getMonthlyBookCount,
  getCumulativeBookCount,
};
