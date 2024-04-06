import connection from "../config/dbConnection.js";
const getBookRequest = (req, res) => {
  const sql = "SELECT id,title,author,edition , reason FROM bookrequest ";
  // Execute the query
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }

    // If the query is successful, return the result with correct field names
    res.json({ success: true, requests: result });
  });
};

const getBookRequestbyId = (req, res) => {
  const sql = "SELECT * FROM bookrequest WHERE user_id=" + req.params.id;
  // Execute the query
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing MySQL query:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }

    // If the query is successful, return the result with correct field names
    res.json({ success: true, requests: result });
  });
};

const addBookRequest = (req, res) => {
  const { title, author, edition, publisher, reason, user_id } = req.body;
  const selectQuery = `
              SELECT isbn.title, isbn.author_id, isbn.edition, author.name, publisher.name
              FROM isbn
                       JOIN author ON isbn.author_id = author.id
                       JOIN publisher ON isbn.publisher_id = publisher.id
              WHERE isbn.title = ? AND author.name = ? AND isbn.edition = ? AND publisher.name = ? 
          `;
  const selectValues = [title, author, edition, publisher];

  // Execute SELECT query to check if the data already exists
  connection.query(selectQuery, selectValues, (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error executing MySQL SELECT query:", selectErr);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
      return;
    }

    // If data already exists, return error response
    if (selectResult.length > 0) {
      res
        .status(400)
        .json({ success: false, message: "Request already exists" });
      return;
    }

    // If data doesn't exist, proceed with INSERT query
    const insertQuery =
      "INSERT INTO bookrequest (title, author, edition, publisher,reason,status,user_id) VALUES (?, ?, ?, ?,?,?,?)";
    const insertValues = [
      title,
      author,
      edition,
      publisher,
      reason,
      "Pending",
      user_id,
    ];

    // Execute INSERT query
    connection.query(insertQuery, insertValues, (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Error executing MySQL INSERT query:", insertErr);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
        return;
      }

      // If the query is successful, return success response
      res.json({ success: true, message: "Request added successfully" });
    });
  });
};

const pendingRequest = (req, res) => {
  const selectQuery = `SELECT * FROM bookrequest WHERE status= 'PENDING'`;
  connection.query(selectQuery, (err, data) => res.json(err ? err : data));
};
const requestHistory = (req, res) => {
  const selectQuery = `SELECT * FROM bookrequest WHERE status ="Approved" OR status ="Rejected"`;
  connection.query(selectQuery, (err, data) => res.json(err ? err : data));
};

const manageRequest = (req, res) => {
  console.log("imin");
  const ids = req.params.ids.split(",").map((id) => parseInt(id, 10));

  console.log(ids);
  const { type } = req.body;
  const newStatus = type === "Approve" ? "Approved" : "Rejected";
  const now = new Date(); // Get current date and time

  if (!Array.isArray(ids)) {
    return res
      .status(400)
      .json({ message: "You must provide an array of ids." });
  }

  const queryString = `UPDATE bookrequest SET status = ?, request_date=? WHERE id IN  (?)`;
  const params = [newStatus, now, ids];
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

export {
  getBookRequest,
  addBookRequest,
  pendingRequest,
  manageRequest,
  requestHistory,
  getBookRequestbyId,
};
