import { format } from "date-fns";
import asyncHandler from "express-async-handler";
import connection from "../config/dbConnection.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

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
  const { name, email, password, birthdate, fileName } = req.body;
  const hashedPassword = await hash(password, 10);
  const today = new Date();

  const imageData = Buffer.from(
    fileName.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  connection.query(
    "INSERT INTO user (name, email, password, join_date, birth_date, role_id, image_file) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      name,
      email,
      hashedPassword,
      new Date().toISOString().split("T")[0],
      new Date(birthdate).toISOString().split("T")[0],
      1,
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
          } else {
            // Passwords don't match
            return res.status(401).json({ message: "Incorrect password" });
          }
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
};
