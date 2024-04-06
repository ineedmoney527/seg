import connection from "../config/dbConnection.js";
const reserve = (req, res) => {
  const { requested_at, status, book_code, user_id } = req.body;

  const insertQuery =
    "INSERT INTO bookreservation (requested_at,start_datetime, end_datetime, status, book_code, user_id) VALUES (?,?, ?, ?, ?, ?)";
  connection.query(
    insertQuery,
    [requested_at, null, null, status, book_code, user_id],
    (err, result) => {
      if (err) {
        console.error("Error inserting reserve record:", err);
        return res.json({ message: "Error inserting reserve record" });
      }
      res.json({
        message:
          "Successfull Reservation Request, Please wait for librarian to approve",
      });
    }
  );
};

const pendingReserve = (req, res) => {
  const selectQuery = `SELECT bookreservation.id, bookreservation.user_id, book.book_code, isbn.title, author.name, isbn.edition, bookreservation.requested_at, bookreservation.status FROM bookreservation JOIN book ON book.book_code = bookreservation.book_code JOIN isbn ON isbn.isbn = book.isbn JOIN author on author.id = isbn.author_id JOIN user ON user.id = bookreservation.user_id WHERE bookreservation.status ="Pending"`;
  connection.query(selectQuery, (err, data) => res.json(err ? err : data));
};

const reserveHistory = (req, res) => {
  const selectQuery = `SELECT bookreservation.id, bookreservation.user_id, book.book_code, isbn.title, author.name, isbn.edition, bookreservation.requested_at,bookreservation.start_datetime,bookreservation.end_datetime, bookreservation.status FROM bookreservation JOIN book ON book.book_code = bookreservation.book_code JOIN isbn ON isbn.isbn = book.isbn JOIN author on author.id = isbn.author_id JOIN user ON user.id = bookreservation.user_id`;
  connection.query(selectQuery, (err, data) => res.json(err ? err : data));
};

const manageReserves = (req, res) => {
  const ids = req.params.ids.split(",").map((id) => parseInt(id, 10));
  const { type } = req.body;
  const newStatus = type === "Approve" ? "Approved" : "Rejected";
  const now = new Date(); // Get current date and time
  const tomorrow = new Date(now); // Create a new date object with current date and time
  tomorrow.setDate(now.getDate() + 1); // Set the date to tomorrow
  if (!Array.isArray(ids)) {
    return res
      .status(400)
      .json({ message: "You must provide an array of ids." });
  }

  const queryString = `UPDATE bookreservation SET status = ?, start_datetime = ?, end_datetime = ? WHERE id IN  (?)`;
  const params = [newStatus, now, tomorrow, ids];
  connection.query(queryString, params, (err, data) => {
    if (err) {
      console.error("Error managing reserve requests:", err);
      res.status(500).json({
        message: "An error occurred while managing reservation requests.",
      });
    } else {
      res.json({ message: "Reservation approved/rejected successfully." });
    }
  });
};

const deleteReservation = (req, res) => {
  const { bookCodes, user_id } = req.params;
  const getBookCodesQuery = `SELECT book_code FROM book WHERE isbn = ?`;

  connection.query(getBookCodesQuery, [bookCodes], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length > 0) {
      const bookCodesArray = results.map((row) => row.book_code);

      const deleteReservationQuery = `DELETE FROM bookreservation WHERE book_code IN (?) AND user_id=?`;
      connection.query(
        deleteReservationQuery,
        [bookCodesArray, user_id],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const updateStatus = `UPDATE book SET status='Available' WHERE book_code IN (?)`;
          connection.query(updateStatus, [bookCodesArray], (err, results) => {
            if (err) {
              return res.status(500).json({ error: "Internal Server Error" });
            }
            return res
              .status(200)
              .json({ message: "Delete Reservation successfully" });
          });
        }
      );
    } else {
      res
        .status(404)
        .json({ message: "Book not found with the specified ISBN" });
    }
  });
};

const checkReservation = (req, res) => {
  const { isbn, user_id } = req.params;

  const getBookCodesQuery = `SELECT book_code FROM book WHERE isbn = ?`;
  connection.query(getBookCodesQuery, [isbn], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length > 0) {
      // Extract book codes from each object and map them to a new array
      const bookCodesArray = results.map((row) => row.book_code);
      console.log(bookCodesArray);
      const checkBookReservationsQuery = `
          SELECT *
          FROM bookreservation 
          WHERE book_code IN (?)
            AND user_id = ?
            AND status = 'Approved' 
     
        `;

      connection.query(
        checkBookReservationsQuery,
        [bookCodesArray, user_id],
        (err, reservationResults) => {
          console.log(reservationResults);
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          }

          if (reservationResults.length > 0) {
            console.log("test 3");
            const validBookCodes = reservationResults.map(
              (result) => result.book_code
            );
            const end_datetime = reservationResults.map(
              (result) => result.end_datetime
            );

            res.status(200).json({
              valid_book_codes: validBookCodes,
              end_datetime: end_datetime,
            });
          } else {
            res.status(404).json({
              message:
                "No valid book codes found for the specified ISBN and user_id",
            });
          }
        }
      );
    } else {
      res
        .status(404)
        .json({ message: "Book not found with the specified ISBN" });
    }
  });
};

const checkPending = (req, res) => {
  const { isbn, user_id } = req.params;

  const getBookCodesQuery = `SELECT book_code FROM book WHERE isbn = ?`;

  connection.query(getBookCodesQuery, [isbn], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      const bookCodes = results.map((result) => result.book_code);
      const bookCodesString = bookCodes.join(",");

      const checkBookReservationsQuery = `
        SELECT book_code, end_datetime
        FROM bookreservation 
        WHERE book_code IN (${bookCodesString}) 
          AND user_id = ? 
          AND status = 'Pending' 
      
      `;

      connection.query(
        checkBookReservationsQuery,
        [user_id],
        (err, reservationResults) => {
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          }
          console.log("reuslts" + reservationResults);
          if (reservationResults.length > 0) {
            return res.json({ message: "true" });
          } else {
            return res.json({ message: "false" });
          }
        }
      );
    } else {
      return res.json(false);
    }
  });
};
const handleIssue = (req, res) => {
  const { ids, status } = req.body;

  const getBookCodesQuery = `UPDATE bookreservation SET status=? WHERE id IN (?)`;
  connection.query(getBookCodesQuery, [status, ids], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
export {
  reserve,
  pendingReserve,
  checkPending,
  manageReserves,
  reserveHistory,
  checkReservation,
  deleteReservation,
  handleIssue,
};
