import connection from "../config/dbConnection.js";

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
  JOIN author ON author.id = isbn.author_id WHERE borrowedrecord.status="B" AND user_id=${userId}`;

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
  ABS(DATEDIFF(borrowedrecord.end_date, borrowedrecord.start_date)) AS days_overdue,
  DATEDIFF(NOW(), borrowedrecord.end_date) * 5 AS fine
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
};
