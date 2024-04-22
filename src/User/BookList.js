import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BookCover1 from "../Image/BookCover1.png";
import BookCover2 from "../Image/BookCover2.png";
import BookCover3 from "../Image/BookCover3.png";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Rating from "@mui/material/Rating";
import Popover from "@mui/material/Popover";
import { Link } from "react-router-dom";
import BookFilter from "./BookFilter";
import ViewBook from "./ViewBook";
import Layout from "./Layout";
import axios from "axios";
import { Buffer } from "buffer";
const BookList = () => {
  // const genres = [
  //   "Fiction",
  //   "Narrative",
  //   "Novel",
  //   "Programming",
  //   "Finance",
  //   "Math",
  //   "Discrete Math",
  //   "History",
  //   "Account",
  // ];
  const [genreLength, setGenreLength] = useState(0); // Define genreLength state
  const [genres, setGenres] = useState([]);
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [ratingRange, setRatingRange] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // State to manage filter popover anchor element
  const [yearRange, setYearRange] = useState([]); // Define selectedBook
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [genreCheckboxes, setGenreCheckboxes] = useState(
    Array.from({ length: 9 }, () => false)
  );
  const [selectedGenres, setSelectedGenres] = useState([]); // Define selectedGenres

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/bookinfo/genre/book"
        );
        console.log("Response:", response.data);
        setGenres(response.data); // Assuming the response contains a 'genres' array
        console.log("Genres:", genres);
        setGenreLength(response.data.name.length); // Set genreLength with the length of genres
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget); // Set anchor element for filter popover
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null); // Close filter popover
  };

  const openFilter = Boolean(filterAnchorEl);

  const handleChange = (event, newValue) => {
    setRatingRange(newValue); // Update rating range state
  };

  const handleChangeYear = (event, newValue) => {
    setYearRange(newValue); // Update year range state
  };

  const handleChangeGenre = (selectedGenres) => {
    setSelectedGenres(selectedGenres); // Update selected genres state
    // console.log("Selected Genres:", selectedGenres);
  };

  // useEffect(() => {
  //   console.log("Selected Genres:", selectedGenres);
  // }, [selectedGenres]);

  const handleReset = () => {
    setRatingRange([]);
    setYearRange([]);
    setGenreCheckboxes(Array.from({ length: genreLength }, () => false));
    setSelectedGenres([]); // Reset selected genres
    const selectedGenres = genres.filter(
      (genre, index) => genreCheckboxes[index]
    );
    console.log("Genres:", selectedGenres);
  };

  const handleViewBookClick = (book) => {
    setSelectedBook(book);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prevShowSearchBar) => !prevShowSearchBar); // Toggle the visibility of the search bar
  };

  // const handleApplyFilter = (newRatingRange, newYearRange) => {
  //   setRatingRange(newRatingRange);
  //   setYearRange(newYearRange);
  //   console.log("Rating Range:", ratingRange);
  //   console.log("Year Range:", yearRange);
  //   console.log("Selected Genres:", genreCheckboxes);
  //   console.log(genres[0]);

  //   handleFilterClose(); // Close the filter popover after applying the filter
  // };

  // const fetchBooks = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/book/searching/mo`
  //     );
  //     console.log(response);
  //     setBooks(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching books:", error);
  //   }
  // };
  const fetchBooks = async (searchQuery = null) => {
    try {
      let url = "http://localhost:5000/api/book";
      if (searchQuery !== null) {
        url = `http://localhost:5000/api/book/searching/${searchQuery}`;
      }
      const response = await axios.get(url);
      console.log(response);
      if (searchQuery !== null) {
        setBooks(response.data.data); // Update books state with the response data's 'data' property
      } else {
        setBooks(response.data); // Update books state with the entire response data
      }
      console.log("Response Data", response.data);
      console.log("NEW BOOKS", books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      console.log("Fetching all books");
      fetchBooks();
    } else {
      console.log("Search Query:", searchQuery);
      console.log("Fetching books based on search query");
      fetchBooks(searchQuery);
    }
  }, [searchQuery]);

  // useEffect(() => {
  //   fetchBooks();
  // }, []);
  // const books = [
  //   {
  //     title: "Madness: Race and Insanity in a Jim Crow Asylum",
  //     rating: "5",
  //     description:
  //       "In the riveting narrative 'Madness', " +
  //       "journalist Antonia Hylton delves into the 93-year history of Crownsville Hospital, " +
  //       "exploring race, insanity, and neglect. This poignant tale sheds light on the struggles of " +
  //       "marginalized communities in accessing mental healthcare." +
  //       "In the riveting narrative 'Madness', " +
  //       "journalist Antonia Hylton delves into the 93-year history of Crownsville Hospital, " +
  //       "exploring race, insanity, and neglect. This poignant tale sheds light on the struggles of " +
  //       "marginalized communities in accessing mental healthcare.",
  //     imgPath: BookCover1,
  //   },
  // ];

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    console.log("Search Query:", value);
    // if (value === "") {
    //   fetchBooks(); // Fetch all books if search query is empty
    // } else {
    //   fetchBooks(value); // Fetch books based on search query
    // }
  };

  return (
    <Box sx={{ backgroundColor: "#EFEEEE" }}>
      <Layout
        showSearchBar={showSearchBar}
        toggleSearchBar={toggleSearchBar}
        toggleDrawer={toggleDrawer}
        open={open}
      >
        {!selectedBook && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "250px",
                borderRadius: "20px",
                backgroundColor: "white",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                marginRight: "auto",
                marginLeft: "70px",
                marginTop: "20px",
              }}
            >
              <SearchIcon />
              <InputBase
                placeholder="Find Your Books…"
                inputProps={{ "aria-label": "search" }}
                sx={{
                  ml: 1,
                  borderRadius: "20px",
                  color: "dark grey",
                  fontSize: "14px",
                }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>

            <Box>
              <button
                onClick={handleFilterClick}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "150px",
                  height: "30px",
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  marginLeft: "auto",
                  marginRight: "70px",
                  marginTop: "20px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Filter
              </button>
            </Box>
          </Box>
        )}
      </Layout>

      <Popover
        open={openFilter}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            marginTop: "30px",
            width: "400px",
            maxHeight: "420px",
            borderRadius: "10px",
            borderColor: "#102B52",
            borderWidth: "2px",
            borderStyle: "solid",
            overflowY: "auto",
          },
        }}
      >
        <BookFilter
          ratingRange={ratingRange}
          handleChange={handleChange}
          yearRange={yearRange}
          handleChangeYear={handleChangeYear}
          handleReset={handleReset}
          handleChangeGenre={handleChangeGenre}
          // handleApplyFilter={handleApplyFilter}
        />
      </Popover>
      <Box>
        {
          !selectedBook &&
            (console.log("Test 2.0"),
            console.log("Books", selectedBook),
            console.log(books),
            console.log("Genre", books.genre_name),
            console.log(ratingRange),
            console.log(yearRange),
            console.log(selectedGenres),
            (
              <List>
                {books
                  ?.filter((book) => {
                    // Apply filtering conditions here
                    const ratingInRange =
                      !ratingRange.length ||
                      (parseFloat(book.rating) >= ratingRange[0] &&
                        parseFloat(book.rating) <= ratingRange[1]);

                    const yearMatches =
                      !yearRange.length ||
                      (book.publish_year &&
                        parseInt(book.publish_year) >= yearRange[0] &&
                        parseInt(book.publish_year) <= yearRange[1]);

                    const genreMatches =
                      !selectedGenres.length ||
                      selectedGenres.includes(book.genre_name);

                    // Return true if the book satisfies all filtering conditions
                    // console.log("Selected Genres:", book.genre_name);
                    return ratingInRange && yearMatches && genreMatches;
                  })
                  .map((book, index) => (
                    <ListItem key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          width: "90%",
                          height: "auto",
                          backgroundColor: "white",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                          marginTop: "auto",
                          marginBottom: "auto",
                          marginLeft: "auto",
                          marginRight: "auto",
                          borderRadius: "10px",
                          alignItems: "center",
                          padding: "10px",
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          <img
                            src={`data:image/png;base64,${Buffer.from(
                              book.image
                            ).toString("base64")}`}
                            alt={book.title}
                            style={{
                              marginLeft: "10px",
                              marginRight: "25px",
                              width: "80px",
                              height: "110px",
                              borderRadius: "10px",
                              marginBottom: "auto",
                              marginTop: "auto",
                            }}
                          />
                          <Box>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{
                                width: "auto",
                                fontWeight: "bold",
                                fontSize: "16px",
                              }}
                            >
                              {book.title}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "bold", marginRight: "5px" }}
                              >
                                Rating:
                              </Typography>
                              <Rating
                                name="read-only"
                                value={parseFloat(book.rating)}
                                readOnly
                                precision={0.5}
                              />
                            </Box>
                            <Typography
                              sx={{ fontSize: "15px", color: "#626262" }}
                              variant="body1"
                              gutterBottom
                            >
                              {book.description}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ marginLeft: "auto" }}>
                          <Link to="/ViewBook" state={{ book: book }}>
                            <button
                              onClick={() => handleViewBookClick(book)}
                              style={{
                                width: "70px",
                                height: "25px",
                                backgroundColor: "white",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                                fontSize: "13px",
                                borderRadius: "20px",
                                border: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                            >
                              View
                            </button>
                          </Link>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                {/* Display link if no books found after filtering */}
                {books?.filter((book) => {
                  // Apply filtering conditions here
                  const ratingInRange =
                    !ratingRange.length ||
                    (parseFloat(book.rating) >= ratingRange[0] &&
                      parseFloat(book.rating) <= ratingRange[1]);

                  const yearMatches =
                    !yearRange.length ||
                    (book.publish_year &&
                      parseInt(book.publish_year) >= yearRange[0] &&
                      parseInt(book.publish_year) <= yearRange[1]);

                  const genreMatches =
                    !selectedGenres.length ||
                    selectedGenres.includes(book.genre_name);

                  // Return true if the book satisfies all filtering conditions
                  return ratingInRange && yearMatches && genreMatches;
                }).length === 0 && (
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", margin: "20px auto" }}
                  >
                    No books match the selected filters. You can explore more
                    books{" "}
                    <a href="https://library.soton.ac.uk/homepage">here</a>.
                  </Typography>
                )}
              </List>
            ))

          // <List>
          //   {books?.map((book, index) => (
          //     <ListItem key={index}>
          //       <Box
          //         sx={{
          //           display: "flex",
          //           width: "90%",
          //           height: "auto",
          //           backgroundColor: "white",
          //           boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
          //           marginTop: "auto",
          //           marginBottom: "auto",
          //           marginLeft: "auto",
          //           marginRight: "auto",
          //           borderRadius: "10px",
          //           alignItems: "center",
          //           padding: "10px",
          //         }}
          //       >
          //         <Box sx={{ display: "flex", flexDirection: "row" }}>
          //           <img
          //             src={`data:image/png;base64,${Buffer.from(
          //               book.image
          //             ).toString("base64")}`}
          //             alt={book.title}
          //             style={{
          //               marginLeft: "10px",
          //               marginRight: "25px",
          //               width: "80px",
          //               height: "110px",
          //               borderRadius: "10px",
          //               marginBottom: "auto",
          //               marginTop: "auto",
          //             }}
          //           />
          //           <Box>
          //             <Typography
          //               variant="h6"
          //               component="div"
          //               sx={{
          //                 width: "auto",
          //                 fontWeight: "bold",
          //                 fontSize: "16px",
          //               }}
          //             >
          //               {book.title}
          //             </Typography>
          //             <Box sx={{ display: "flex", alignItems: "center" }}>
          //               <Typography
          //                 variant="body2"
          //                 sx={{ fontWeight: "bold", marginRight: "5px" }}
          //               >
          //                 Rating:
          //               </Typography>
          //               <Rating
          //                 name="read-only"
          //                 value={parseFloat(book.rating)}
          //                 readOnly
          //                 precision={0.5}
          //               />
          //             </Box>
          //             <Typography
          //               sx={{ fontSize: "15px", color: "#626262" }}
          //               variant="body1"
          //               gutterBottom
          //             >
          //               {book.description}
          //             </Typography>
          //           </Box>
          //         </Box>
          //         <Box sx={{ marginLeft: "auto" }}>
          //           <Link to="/ViewBook" state={{ book: book }}>
          //             <button
          //               onClick={() => handleViewBookClick(book)}
          //               style={{
          //                 width: "70px",
          //                 height: "25px",
          //                 backgroundColor: "white",
          //                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          //                 fontSize: "13px",
          //                 borderRadius: "20px",
          //                 border: "none",
          //                 cursor: "pointer",
          //                 marginLeft: "20px",
          //               }}
          //             >
          //               View
          //             </button>
          //           </Link>
          //         </Box>
          //       </Box>
          //     </ListItem>
          //   ))}
          // </List>
        }
        {selectedBook && <ViewBook book={selectedBook} />}
      </Box>
    </Box>
  );
};

export default BookList;
