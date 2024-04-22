import connection from "../config/dbConnection.js";
import nodemailer from "nodemailer";

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
      "INSERT INTO bookrequest (title, author, edition, publisher,reason,status,request_date,user_id) VALUES (?, ?, ?, ?,?,?,?,?)";
    const insertValues = [
      title,
      author,
      edition,
      publisher,
      reason,
      "Pending",
      new Date(),
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
  const { type, title, student_id } = req.body;

  console.log(ids);
  console.log(type);
  console.log(title);
  console.log(student_id);

  const newStatus = type === "Approve" ? "Approved" : "Rejected";
  const now = new Date(); // Get current date and time

  if (!Array.isArray(ids)) {
    return res
      .status(400)
      .json({ message: "You must provide an array of ids." });
  }

  const emailQuery = `SELECT email FROM user WHERE id = ?`;

  // Execute the query to retrieve the email associated with the student_id
  connection.query(emailQuery, student_id, (emailErr, emailResult) => {
    if (emailErr) {
      console.error("Error retrieving email:", emailErr);
      return res.status(500).json({
        message: "An error occurred while retrieving email.",
      });
    }
    const email =
      emailResult && emailResult.length > 0 ? emailResult[0].email : null;

    if (email) {
      const queryString = `UPDATE bookrequest SET status = ?, request_date=? WHERE id IN  (?)`;
      const params = [newStatus, now, ids];
      connection.query(queryString, params, (err, data) => {
        if (err) {
          console.error("Error managing reserve requests:", err);
          res.status(500).json({
            message: "An error occurred while managing reservation requests.",
          });
        } else {
          // Send email to user
          ids.forEach((id) => {
            sendRequestStatus(email, newStatus, title, id);
          });
          res.json({ message: "Reservation approved/rejected successfully." });
        }
      });
    } else {
      res
        .status(404)
        .json({ message: "Email not found for the provided student ID." });
    }
  });
};

const sendRequestStatus = (userEmail, status, title, request_id) => {
  console.log("userEmail: ", userEmail);
  console.log("status: ", status);
  console.log("title: ", title);
  console.log("reserve_id: ", request_id);
  if (!request_id) {
    request_id = "N/A";
  }

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // Outlook SMTP server
    port: 587, // secure SMTP
    secure: false, // false for TLS - as a boolean not string - if true, use port 465
    auth: {
      user: "Sotonlibrary@outlook.com", // Your Outlook email address
      pass: "rfqyidusxajksjec", // Use the app-specific password here
    },
  });

  // Email content
  const mailOptions = {
    from: "Sotonlibrary@outlook.com", // Your Outlook email address
    to: userEmail, // Recipient's email address
    subject: "Library Request Status", // Email subject
    text: `Dear user,\n\nThis is a status update for request ${request_id}.\n\n Request status: ${status}\n\n Book: ${title}. \n\nPlease check your account for more details.\n\nRegards,\nLibrary Team`, // Email content
  };

  // Sending the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
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
