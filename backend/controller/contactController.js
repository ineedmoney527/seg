import { format } from "date-fns";
import asyncHandler from "express-async-handler";
import connection from "../config/dbConnection.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

// Create a new Date object for today's date
// Concatenate the components to form the dd/mm/yyyy format
function _arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
function handleQueryError(res, err) {
  switch (err.code) {
    // Check for duplicate entry
    case "ER_DUP_ENTRY":
      let errorMessage = "";
      if (err.sqlMessage.includes("email")) {
        errorMessage = "Email already exists";
      }
      return res.json({ success: false, message: errorMessage });

    default:
      return res.status(401).json({ err });
  }
}

//@desc Create new contats
//@route POST /api/user
//@access public

const createUser = async (req, res) => {
  const { id, name, email, password, birthdate, fileName } = req.body;
  const hashedPassword = await hash(password, 10);
  const today = new Date();

  const imageData = Buffer.from(
    fileName.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  connection.query(
    "INSERT INTO user (id,name, email, password, join_date, birth_date, role_id, image_file) VALUES (?,?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      name,
      email,
      hashedPassword,
      new Date().toISOString().split("T")[0],
      new Date(birthdate).toISOString().split("T")[0],
      2,
      imageData,
    ],
    (err, data) => {
      if (err) {
        return handleQueryError(res, err);
      }
      return res
        .status(201)
        .json({ success: true, message: "User added successfully" });
    }
  );
};

//@desc Get all contats
//@route GET /api/user
//@access public
const readUser = (req, res) => {
  const query =
    "SELECT image_file, id, name, email, DATE_FORMAT(join_date, '%Y-%m-%d') AS join_date, DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date,role_id, borrow_limit FROM user WHERE role_id IN" +
    req.params.role_id;
  connection.query(query, (err, data) => {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });
};

//@desc Get contact by id
//@route GET /api/contacts/:id
//@access public
const readContactById = asyncHandler(async (req, res) => {
  const query = "SELECT * FROM user where `id`=" + req.params.id;
  connection.query(query, (err, data) =>
    res.json(err ? { message: "User not found" } : data)
  );
});

//

//@desc Update contact by id
//@route PUT /api/contacts/:id
//@access public
const updateContact = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);

  const { name, email, birthdate, fileName } = req.body;
  const queryString =
    "UPDATE user SET `image_file`=?,`name` = ?, `email`=?,`birth_date`=? WHERE `id`=?";
  connection.query(
    queryString,
    [
      Buffer.from(fileName.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      name,
      email,
      new Date(birthdate),
      userId,
    ],
    (err, data) =>
      err
        ? handleQueryError(res, err)
        : res
            .status(201)
            .json({ success: true, message: "User updated successfully" })
  );
};

//@desc Delete contact by id
//@route  DELETE /api/contacts/:id
//@access public
const deleteContact = (req, res) => {
  const id = req.params.id; // Assuming the parameter is named 'id'
  const queryString = "DELETE FROM user WHERE id = ?";
  connection.query(queryString, [id], (err, data) => {
    if (err) {
      console.error("Error deleting user:", err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the user." });
    } else {
      res.json({ message: "User deletedddd successfully" });
    }
  });
};
const deleteContacts = (req, res) => {
  const ids = req.params.ids.split(",").map((id) => parseInt(id, 10));

  if (!Array.isArray(ids)) {
    return res
      .status(400)
      .json({ message: "You must provide an array of IDs to delete." });
  }

  const queryString = "DELETE FROM `user` WHERE `id` IN  (?)";
  connection.query(queryString, [ids], (err, data) => {
    if (err) {
      console.error("Error deleting users:", err);
      res
        .status(500)
        .json({ message: "An error occurrdeed while deleting the users." });
    } else {
      res.json({ message: "Users deleted successfully." });
    }
  });
};
const updateLimit = (req, res) => {
  const { id, limit } = req.body;
  const updateQuery = `UPDATE user SET borrow_limit = ? WHERE id = ?`;
  connection.query(updateQuery, [limit, id], (err, results) => {
    if (err) {
      return res.json({ message: " Error occurs when updating book status" });
    } else {
      res.json({ message: " Rows updated:" + results.affectedRows });
    }
  });
};

const login = (req, res) => {
  console.log("hihi");
  const { username, password } = req.body;

  // Check if email exists in the database
  connection.query(
    "SELECT * FROM `user` WHERE email = ?",
    [username],
    async (err, results) => {
      console.log(results);
      console.log(username);
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email" });
      }

      // Compare hashed password with provided password
      const user = results[0];

      try {
        if (await compare(password, user.password)) {
          if (true) {
            // Passwords match, generate JWT token
            const token = jwt.sign({ id: user.id }, "seg-project", {
              expiresIn: "1h",
            });

            return res.status(200).json({
              message: "Token has been sent",
              success: true,
              token: token,
              user: user,
            });
          }
        } else {
          // Passwords don't match
          return res.status(401).json({ message: "Incorrect password" });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Internal Server Error" + error.message });
      }
    }
  );
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, "seg-project", (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
}

const getLimit = asyncHandler(async (req, res) => {
  console.log("id" + req.params.id);
  const query = "SELECT borrow_limit FROM user where `id`=" + req.params.id;
  connection.query(query, (err, data) =>
    res.json(err ? { message: "User not found" } : data[0])
  );
});

// Generate a password reset token
function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

// Send email with password reset link
async function sendResetEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // Outlook SMTP server
    port: 587, // secure SMTP
    secure: false, // false for TLS - as a boolean not string - if true, use port 465
    auth: {
      user: "librarydummy@outlook.com", // Your Outlook email address
      pass: "mpnggzkxoqjsxjxd", // Use the app-specific password here
    },
  });

  const mailOptions = {
    from: "librarydummy@outlook.com",
    to: email,
    subject: "Password Reset -- UoSM Library System",
    text: ` Here is the OTP to reset the password: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

const forgotPassword = (req, res) => {
  const { email } = req.body;

  // Check if the email exists in the user table
  connection.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (error, results) => {
      if (error || results.length === 0) {
        return res.json({ success: false, error: "Email not found" });
      }
      connection.query(
        "DELETE FROM password_reset_tokens WHERE email = ?",
        [email],
        (deleteError) => {
          if (deleteError) {
            console.error("Failed to delete OTP:", deleteError);
          }
        }
      );
      const otp = otpGenerator.generate(5, {
        upperCase: false,
        specialChars: false,
      }); // Generate OTP
      console.log(otp);
      const expires = new Date(Date.now() + 600000); // OTP expires in 10 minutes
      const otpData = { email, otp, expires };

      // Store OTP in the password_reset_tokens table
      connection.query(
        "INSERT INTO password_reset_tokens SET ?",
        otpData,
        async (insertError) => {
          if (insertError) {
            console.log("insert error");
            return res
              .status(500)
              .json({ success: false, error: "Failed to store OTP" });
          }

          // Send OTP to the user via email or SMS (not implemented here)
          try {
            await sendResetEmail(email, otp);
            res.json({ success: true, message: "Reset email sent" });
            console.log("haha");
          } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, error: err.message });
          }
        }
      );
    }
  );
};
const verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  console.log(email);
  console.log(otp);
  // Check if the OTP is valid and not expired
  connection.query(
    "SELECT * FROM password_reset_tokens WHERE email = ? AND otp = ? AND expires > NOW()",
    [email, otp],
    (error, results) => {
      if (error || results.length === 0) {
        return res.json({
          success: false,
          error: "Invalid OTP or OTP expired",
        });
      }

      res.json({ success: true, message: "OTP verified successfully" });
    }
  );
};

const resetPassword = (req, res) => {
  const { email, newPassword } = req.body;

  // Hash the new password before updating
  hash(newPassword, 10, (hashError, hashedPassword) => {
    if (hashError) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to hash password" });
    }

    // Update the password in the user table
    connection.query(
      "UPDATE user SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (updateError) => {
        if (updateError) {
          return res
            .status(500)
            .json({ success: false, error: "Failed to update password" });
        }

        // Delete the OTP from the password_reset_tokens table
        connection.query(
          "DELETE FROM password_reset_tokens WHERE email = ?",
          [email],
          (deleteError) => {
            if (deleteError) {
              console.error("Failed to delete OTP:", deleteError);
            }

            res.json({ success: true, message: "Password reset successful" });
          }
        );
      }
    );
  });
};

export {
  createUser,
  readUser,
  readContactById,
  deleteContact,
  deleteContacts,
  updateContact,
  login,
  authenticateToken,
  updateLimit,
  getLimit,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
