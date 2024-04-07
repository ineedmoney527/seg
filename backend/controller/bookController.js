import connection from "../config/dbConnection.js";

const addBook = async (req, res) => {
  try {
    const {
      isbn,
      title,
      author,
      edition,
      country,
      publisher,
      publishedYear,
      pages,
      price,
      location,
      descriptions,
      status,
      fileName,
      callNumber,
    } = req.body;
    console.log(author);
    const { edit, code } = req.body;
    const imageData = Buffer.from(
      fileName.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    let countryId;
    let publisherId;
    // Check if author record already exists
    // Check if author record already exists
    let authorId;
    const existingAuthor = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM author WHERE name = ?",
        [author],
        (err, results) => {
          if (err) {
            return reject(err);
          }

          if (results.length > 0) {
            authorId = results[0].id;
            return resolve(results[0]);
          } else {
            const insertAuthorResult = connection.query(
              "INSERT INTO author (name) VALUES (?)",
              [author],
              (err, results) => {
                if (err) {
                  return reject(err);
                }

                authorId = results.insertId;
                return resolve({ id: authorId, name: author });
              }
            );
          }
        }
      );
    });

    // Check if country record already exists
    const existingCountry = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM country WHERE name = ?",
        [country],
        async (err, results) => {
          if (err) {
            return reject(err);
          }

          if (results.length > 0) {
            countryId = results[0].id;
            resolve({ id: countryId, name: country });
          } else {
            const insertCountryResult = await connection.query(
              "INSERT INTO country (name) VALUES (?)",
              [country],
              (err, results) => {
                countryId = results.insertId;
                resolve({ id: countryId, name: country });
              }
            );
          }
        }
      );
    });

    // Fetch existing publisher or insert new publisher
    const existingPublisher = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM publisher WHERE name = ?",
        [publisher],
        async (err, results) => {
          if (err) {
            return reject(err);
          }

          if (results.length > 0) {
            publisherId = results[0].id;
            resolve({ id: publisherId, name: publisher });
          } else {
            const insertPublisherResult = await connection.query(
              "INSERT INTO publisher (name, country_id) VALUES (?, ?)",
              [publisher, countryId], // Use existingCountry.id as country_id
              (err, results) => {
                publisherId = results.insertId;
                resolve({ id: publisherId, name: publisher });
              }
            );
          }
        }
      );
    });

    console.log(authorId);
    console.log(countryId);
    console.log(publisherId);
    connection.query(
      "SELECT * FROM isbn WHERE isbn = ?",
      [isbn],
      async (error, isbnResults) => {
        if (error) {
          console.error("Error executing query for ISBN:", error);
          return res
            .status(500)
            .json({ error: "An error occurred while checking ISBN" });
        }

        if (isbnResults.length > 0) {
          // ISBN exists, update the record
          connection.query(
            "UPDATE isbn SET image=?, title=?, description=?, pages=?, publish_year=?, edition=?, country_id=?, price=?, author_id=?, publisher_id=?, average_rating=? WHERE isbn = ?",
            [
              imageData,
              title,
              descriptions,
              pages,
              publishedYear,
              edition,
              countryId,
              price,
              authorId,
              publisherId,
              2,
              isbn,
            ],
            (error, updateResult) => {
              if (error) {
                console.error("Error updating ISBN:", error);
                return res.status(500).json({
                  error: "An error occurred while updating ISBN",
                });
              }

              edit
                ? updateBookTable(location, callNumber, status, isbn, code)
                : insertIntoBookTable(location, callNumber, status, isbn);
              // Insert into book table
            }
          );
        } else {
          console.log(isbn);
          // ISBN doesn't exist, insert a new record
          connection.query(
            "INSERT INTO isbn (isbn, image, title, description, pages, publish_year, edition, price, author_id, publisher_id, average_rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              isbn,
              imageData,
              title,
              descriptions,
              pages,
              publishedYear,
              edition,
              price,
              authorId,
              publisherId,
              2,
            ],
            (error, insertResult) => {
              if (error) {
                console.error("Error inserting into ISBN table:", error);
                return res.status(500).json({
                  error: "An error occurred while inserting into ISBN table",
                });
              }
              // Insert into book table
              edit
                ? updateBookTable(location, callNumber, status, isbn, code)
                : insertIntoBookTable(location, callNumber, status, isbn);
            }
          );
        }
      }
    );

    // Function to insert into book table
    const insertIntoBookTable = (location, callNumber, status, isbn) => {
      connection.query(
        "INSERT INTO book ( location, call_number, status, isbn) VALUES ( ?, ?, ?, ?)",
        [location, callNumber, status, isbn],
        (error, bookResult) => {
          if (error) {
            console.error("Error inserting into book table:", error);
            return res.status(500).json({
              error: "An error occurred while inserting into book table",
            });
          }
          res.json({ message: "New book added successfully", success: true });
        }
      );
    };

    const updateBookTable = (location, callNumber, status, isbn, code) => {
      connection.query(
        "UPDATE book SET location = ?, call_number = ?, status = ?, isbn = ? WHERE book_code = ?",
        [location, callNumber, status, isbn, code],
        (error, bookResult) => {
          if (error) {
            console.error("Error updating book table:", error);
            return res.status(500).json({
              error: "An error occurred while updating book table",
            });
          }
          res.json({ message: "Book updated successfully", success: true });
        }
      );
    };
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "An error occurred while adding the book" });
  }
};
//router.get("/", readAllBook);
const readAllBooks = (req, res) => {
  const query =
    "SELECT book.*,isbn.isbn, isbn.title, isbn.image, isbn.description,isbn.pages,author.name AS author_name, isbn.edition,isbn.price,isbn.pages,publisher.name AS publisher_name, isbn.publish_year, country.name AS country_name  FROM book JOIN isbn ON book.isbn = isbn.isbn JOIN author ON isbn.author_id = author.id JOIN publisher ON isbn.publisher_id = publisher.id JOIN country ON publisher.country_id = country.id  ";
  connection.query(query, (err, data) => res.json(err ? err : data));
};

const readAllISBN = (req, res) => {
  const query = "SELECT isbn from isbn";
  connection.query(query, (err, data) => res.json(err ? err : data));
};
const readUniqueBook = (req, res) => {
  // SELECT DISTINCT isbn.isbn, isbn.title, isbn.image, isbn.description, isbn.pages, author.name AS author_name, isbn.edition, isbn.price, isbn.pages, publisher.name AS publisher_name, isbn.publish_year, country.name AS country_name, AVG(bookrating.rating) as rating FROM book JOIN isbn ON book.isbn = isbn.isbn JOIN author ON isbn.author_id = author.id LEFT JOIN bookrating on isbn.isbn= bookrating.isbn JOIN publisher ON isbn.publisher_id = publisher.id JOIN country ON publisher.country_id = country.id GROUP by isbn;

  const query = `  SELECT DISTINCT isbn.isbn, isbn.title, isbn.image, isbn.description, isbn.pages, author.name AS author_name, isbn.edition, isbn.price, isbn.pages, publisher.name AS publisher_name, isbn.publish_year, country.name AS country_name, AVG(bookrating.rating) as rating, genre.name AS genre_name FROM   book JOIN isbn ON book.isbn = isbn.isbn JOIN author ON isbn.author_id = author.id LEFT JOIN bookrating ON isbn.isbn = bookrating.isbn JOIN publisher ON isbn.publisher_id = publisher.id JOIN country ON publisher.country_id = country.id LEFT JOIN genre ON isbn.genre_id = genre.id GROUP  BY isbn.isbn;
`;
  // connection.query(query, (err, data) => res.json(err ? err : data));
  // console.log(data);
  connection.query(query, (err, data) => {
    if (err) {
      console.error(err);
      res.json(err);
    } else {
      console.log(data);
      res.json(data);
    }
  });
};

const readAvailableBooks = (req, res) => {
  const query = `SELECT book.*, isbn.title, isbn.image, isbn.description,isbn.pages,author.name AS author_name, isbn.edition,isbn.price,isbn.pages,publisher.name AS publisher_name, isbn.publish_year, country.name AS country_name  FROM book JOIN isbn ON book.isbn = isbn.isbn JOIN author ON isbn.author_id = author.id JOIN publisher ON isbn.publisher_id = publisher.id JOIN country ON publisher.country_id = country.id WHERE status="Available"`;
  connection.query(query, (err, data) => res.json(err ? err : data));
};
//router.get("/:id", readSpecificBook);
const readSpecificBook = (req, res) => {
  const query =
    "SELECT book.*, isbn.title, isbn.image, author.name AS author_name, isbn.edition, publisher.name AS publisher_name, isbn.publish_year  FROM book JOIN isbn ON book.isbn = isbn.isbn JOIN author ON isbn.author_id = author.id JOIN publisher ON isbn.publisher_id = publisher.id where book.book_code =" +
    req.params.id;
  connection.query(query, (err, data) => res.json(err ? err : data));
};

const checkAvailable = (req, res) => {
  const isbn = req.params.isbn;

  const query =
    "SELECT b.isbn, i.title, COUNT(b.book_code) AS num_books_available FROM book b JOIN isbn i ON b.isbn = i.isbn WHERE b.isbn = ? AND b.status = 'Available' GROUP BY b.isbn, i.title HAVING COUNT(b.book_code) > 0;";

  connection.query(query, [isbn], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    if (results.length > 0) {
      res.json(true); // Send true if there are available books
    } else {
      res.json(false); // Send false if there are no available books
    }
  });
};
const selectBook = (req, res) => {
  const queryString =
    "SELECT * FROM book WHERE status='Available' AND `isbn`=" + req.params.isbn;
  connection.query(queryString, (err, data) =>
    res.json(err ? { message: err.message } : data[0])
  );
};

const readAllBookCode = (req, res) => {
  const { isbn } = req.params;
  const getBookCodeQuery = `SELECT book_code FROM book WHERE isbn = ?`;

  connection.query(getBookCodeQuery, [isbn], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      // If a book with the specified ISBN is found, return the book code
      res.status(200).json(results);
    } else {
      // If no book is found with the specified ISBN, return a message indicating so
      res
        .status(404)
        .json({ message: "Book not found with the specified ISBN" });
    }
  });
};

const deleteBook = (req, res) => {
  const queryString = "DELETE FROM book WHERE `book_code` =" + req.params.id;
  connection.query(queryString, (err, data) =>
    res.json(err ? { message: err.message } : "Book deleted successfully")
  );
};
const deleteBooks = (req, res) => {
  const ids = req.params.ids.split(",").map((id) => parseInt(id, 10));

  if (!Array.isArray(ids)) {
    return res
      .status(400)
      .json({ message: "You must provide an array of Codes to delete." });
  }

  const queryString = "DELETE FROM `book` WHERE `book_code` IN  (?)";
  connection.query(queryString, [ids], (err, data) => {
    if (err) {
      console.error("Error deleting books:", err);
      res
        .status(500)
        .json({ message: "An error occurrdeed while deleting the books." });
    } else {
      res.json({ message: "Books deleted successfully." });
    }
  });
};

const currentTimestamp = new Date();
const oneDayLater = new Date();
oneDayLater.setDate(oneDayLater.getDate() + 1);

const getISBN = (req, res) => {
  const isbn = req.params.id;

  // Query to check if the ISBN exists in the database
  const checkIsbnQuery = `
    SELECT 
     
      isbn.isbn AS isbn,
      isbn.title AS title, 
      author.name AS author_name, 
      isbn.edition AS edition, 
      publisher.name AS publisher_name, 
      country.name AS country_name,  
      isbn.publish_year AS publishedYear,
      isbn.pages AS pages,
      isbn.price AS price,
      isbn.description AS description  -- Include description field
    FROM 
      isbn
      JOIN author ON isbn.author_id = author.id 
      JOIN publisher ON isbn.publisher_id = publisher.id
      JOIN country ON publisher.country_id = country.id  
    WHERE isbn.isbn = ?
  `;

  connection.query(checkIsbnQuery, [isbn], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      const bookDetails = {
        isbn: results[0].isbn,
        author_name: results[0].author_name,
        title: results[0].title,
        edition: results[0].edition,
        publisher_name: results[0].publisher_name,
        country_name: results[0].country_name,
        publishedYear: results[0].publishedYear,
        pages: results[0].pages,
        price: results[0].price,
        description: results[0].description, // Include description in response
      };
      return res.status(200).json(bookDetails);
    }

    // If the ISBN exists, you can send the book details as a response
  });
};
const updateStatus = (req, res) => {
  const { bookCodes, status } = req.body;
  const updateQuery = `UPDATE book SET status = ? WHERE book_code IN (?)`;
  connection.query(updateQuery, [status, bookCodes], (err, results) => {
    if (err) {
      return res.json({ message: " Error occurs when updating book status" });
    } else {
      res.json({ message: " Rows updated:" + results.affectedRows });
    }
  });
};

const rateBook = (req, res) => {
  const sqlQuery = `INSERT INTO bookrating (rating, comments,isbn,user_id) VALUES (?, ?, ?,?)`;
  const { userId, rating, isbn, comments } = req.body;
  // Execute the SQL query with parameters
  connection.query(
    sqlQuery,
    [rating, comments, isbn, userId],
    (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return;
      }
      res.json("Data inserted successfully into bookrating table");
    }
  );
};

const calculateAverageRating = async (req, res) => {
  try {
    const query =
      "SELECT AVG(rating) AS averageRating FROM bookrating WHERE isbn = ?";
    const isbn = req.params.isbn;
    connection.query(query, [isbn], (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return;
      }
      const { averageRating } = result[0];
      return res.json(averageRating);
    });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    throw error;
  }
};

export {
  addBook,
  getISBN,
  readUniqueBook,
  readAllBooks,
  readAvailableBooks,
  deleteBook,
  deleteBooks,
  readSpecificBook,
  checkAvailable,
  readAllISBN,
  readAllBookCode,
  selectBook,
  updateStatus,
  rateBook,
  calculateAverageRating,
};
