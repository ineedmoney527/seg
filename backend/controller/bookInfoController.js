import db from "../config/dbConnection.js";

function handleQueryError(res, err) {
  switch (err.code) {
    case "ER_DUP_ENTRY":
      return res.status(500).json({
        message: err.sqlMessage.includes("PRIMARY")
          ? "ISBN already exists"
          : err.sqlMessage,
      });
    default:
      return res.status(500).json({ err });
  }
}

//@desc Create new isbn
//@route POST /api/bookinfo
//@access public
const createIsbn = async (req, res) => {
  const {
    isbn,
    title,
    description,
    pages,
    publish_year,
    edition,
    price,
    genre_id,
    author_id,
    publisher_id,
    average_rating,
  } = req.body;

  // Check if any required field is missing
  if (
    !isbn ||
    !title ||
    !description ||
    !pages ||
    !publish_year ||
    !edition ||
    !price ||
    !genre_id ||
    !author_id ||
    !publisher_id ||
    !average_rating
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }
  // Assuming db.query is a function that interacts with your database
  const query = `
    INSERT INTO bookinfo (isbn, title, description, pages, publish_year, edition, price, genre_id, author_id, publisher_id, average_rating) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  //field validation
  if (!validateIsbn(isbn)) {
    return;
  }
  db.query(
    query,
    [
      isbn,
      title,
      description,
      pages,
      publish_year,
      edition,
      price,
      genre_id,
      author_id,
      publisher_id,
      average_rating,
    ],
    (err, result) => {
      err ? handleQueryError(res, err) : res.json("User successfully added");
    }
  );
};

//insert query

//@desc Get all ISBN
//@route GET /api/bookinfo
//@access public
const readAllIsbn = (req, res) => {
  const query = "SELECT * FROM bookinfo";
  db.query(query, (err, data) => res.json(err ? err : data));
};
//@desc Get specific ISBN
//@route GET /api/bookinfo/:id
//@access public
const readIsbn = async (req, res) => {
  console.log(req.params.id);

  const query = "SELECT * FROM bookinfo where `isbn`=" + req.params.id;
  db.query(query, (err, data) =>
    res.json(err ? { message: "ISBN not found" } : data)
  );
};

//@desc Update isbn
//@route PUT /api/bookinfo/:id
//@access public
const updateIsbn = async (req, res) => {
  const isbn = req.params.id;
  const {
    new_isbn,
    title,
    description,
    pages,
    publish_year,
    edition,
    price,
    genre_id,
    author_id,
    publisher_id,
    average_rating,
  } = req.body;

  // Validate if new_isbn is provided and if it's a valid ISBN
  if (new_isbn && !validateIsbn(new_isbn)) {
    return res.status(400).json({ error: "Invalid ISBN format for new ISBN." });
  }

  const queryString = `
    UPDATE bookinfo 
    SET isbn=?, title=?, description=?, pages=?, publish_year=?, edition=?, price=?, genre_id=?, author_id=?, publisher_id=?, average_rating=?
    WHERE isbn=?
  `;

  // Parameters for the update query
  const queryParams = [
    new_isbn || isbn, // Use new_isbn if provided, otherwise use existing isbn
    title,
    description,
    pages,
    publish_year,
    edition,
    price,
    genre_id,
    author_id,
    publisher_id,
    average_rating,
    isbn,
  ];

  db.query(queryString, queryParams, (err, data) =>
    err
      ? handleQueryError(res, err)
      : res.json("Book Info successfully updated")
  );
};

//@desc Delete contact by id
//@route  DELETE /api/contacts/:id
//@access public
const deleteIsbn = (req, res) => {
  const queryString = "DELETE FROM bookinfo WHERE `isbn` =" + req.params.id;
  db.query(queryString, (err, data) =>
    res.json(err ? { message: err.message } : "ISBN deleted successfully")
  );
};

const readAllGenre = (req, res) => {
  console.log("test");
  const query = "SELECT name FROM genre";
  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Error executing query" });
      connection.end();
      return;
    } else {
      res.json(results);
      // Map the results to an array of genre names
      const genre = results.map((result) => result.name);

      console.log("Genre:", genre);
    }
  });
};

export {
  createIsbn,
  readAllIsbn,
  readIsbn,
  deleteIsbn,
  updateIsbn,
  readAllGenre,
};
