import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import BookCover1 from "../Image/BookCover1.png";
import BookCover2 from "../Image/BookCover2.png";
import BookCover3 from "../Image/BookCover3.png";
import Popover from "@mui/material/Popover";
import BookFilter from "./BookFilter";
import Layout from "./Layout";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import profile from "../Image/ProfileBanner.png";
import UserRateBook from "./UserRateBook";
import Rating from "@mui/material/Rating";
import { useAuthUser } from "react-auth-kit";
import { Buffer } from "buffer";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const MyLibrary = () => {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [review, setReview] = useState([]);
  const [ratingCount, setRatingCount] = useState([]);
  const [wishListCount, setWishListCount] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [ratingRange, setRatingRange] = useState([1, 5]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [yearRange, setYearRange] = useState([2000, 2022]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [value, setValue] = useState(0);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [borrowCount, setBorrowCount] = useState(null);
  const [userRatings, setUserRatings] = useState({}); // State to store user ratings
  const navigate = useNavigate();
  const historyContainerRef = useRef(null); // Define historyContainerRef
  const user_id = useAuthUser()().id;
  const today_date = new Date();
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const fetchRequests = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/request/" + user_id
    );
    setWishList(response.data.requests);
    setWishListCount(response.data.requests.length);
    console.log(response.data.requests);
  };
  const fetchRatingCount = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/history/rating/" + user_id
    );
    setRatingCount(response.data.data);
  };
  const fetchLoanCount = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/history/loan/" + user_id
    );
    setCurrentLoan(response.data.data);
  };
  const fetchReviews = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/history/review/" + user_id
    );

    setReview(response.data.data);
    console.log(review);
  };
  const fetchBorrowed = async () => {
    try {
      const borrowHistory = await axios.get(
        "http://localhost:5000/api/history/borrow/" + user_id
      );

      const borrowCount = await axios.get(
        "http://localhost:5000/api/history/borrowcount/" + user_id
      );

      setBooks(borrowHistory.data);
      setBorrowCount(borrowCount.data[0].borrow_count);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  // const fetchUserRatings = async (isbn) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/history/hasRated/${user_id}/${isbn}`
  //     );

  //     console.log(response.data.rated);
  //     return response.data.rated;
  //   } catch (error) {
  //     console.error("Error fetching user ratings:", error);
  //   }
  // };
  const hasRatedBook = (isbn) => {
    const ratedBook = userRatings.find((rating) => rating.isbn === isbn);
    return ratedBook && ratedBook.rated;
  };

  useEffect(() => {
    fetchRequests();
    fetchBorrowed();
    fetchLoanCount();
    fetchRatingCount();
    fetchReviews();
  }, []);
  useEffect(() => {
    const fetchUserRatings = async () => {
      try {
        const ratings = await Promise.all(
          books.map(async (book) => {
            const response = await axios.get(
              `http://localhost:5000/api/history/hasRated/${user_id}/${book.isbn}`
            );
            return { isbn: book.isbn, rated: response.data.rated };
          })
        );
        setUserRatings(ratings);
        console.log(ratings);
      } catch (error) {
        console.error("Error fetching user ratings:", error);
      }
    };

    fetchUserRatings();
  }, [user_id, books]); // Add user_id and books as dependencies

  const openFilter = Boolean(filterAnchorEl);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeYear = (event) => {
    const newValue = event.target.value;
    setYearRange(newValue);
  };

  const handleReset = () => {
    setRatingRange([1, 5]);
    setYearRange([2000, 2022]);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prevShowSearchBar) => !prevShowSearchBar); // Toggle the visibility of the search bar
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getTime(); // Returns the time in milliseconds
  };
  const SCROLL_AMOUNT = 100;

  const scrollNext = () => {
    const container = historyContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const targetScroll = Math.min(
        container.scrollLeft + SCROLL_AMOUNT,
        maxScroll
      );
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    const container = historyContainerRef.current;
    if (container) {
      const targetScroll = Math.max(container.scrollLeft - SCROLL_AMOUNT, 0);
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  };

  const handleViewBookClick = (book) => {
    setSelectedBook(book);
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <Box>
      <Layout
        showSearchBar={showSearchBar}
        toggleSearchBar={toggleSearchBar}
        toggleDrawer={toggleDrawer}
        open={open}
      >
        <Box
          sx={{
            width: "100%",
            height: "200px",
            backgroundSize: "cover",
            backgroundImage: `url(${profile})`,
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: "auto",
                marginRight: "50px",
                textAlign: "right",
              }}
            >
              <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>
                Ke Xin Tong
              </Typography>
              <Typography sx={{ fontSize: "15px" }}>
                kexin@soton.ac.uk
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "130px",
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "220px",
              height: "60px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#183764",
              color: "white",
              borderRadius: "10px",
              marginRight: "50px",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            <label style={{}}>Total Borrowed Book</label>
            <label style={{ fontSize: "22px", fontWeight: "bold" }}>
              {borrowCount}
            </label>
          </Box>

          <Box
            sx={{
              width: "220px",
              height: "60px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#183764",
              color: "white",
              borderRadius: "10px",
              marginRight: "50px",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            <label style={{}}>Current Loan</label>
            <label style={{ fontWeight: "bold", fontSize: "22px" }}>
              {currentLoan}
            </label>
          </Box>

          <Box
            sx={{
              width: "220px",
              height: "60px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#183764",
              color: "white",
              borderRadius: "10px",
              marginRight: "50px",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            <label style={{}}>Wishlist</label>
            <label style={{ fontWeight: "bold", fontSize: "22px" }}>
              {wishListCount}
            </label>
          </Box>

          <Box
            sx={{
              width: "220px",
              height: "60px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#183764",
              color: "white",
              borderRadius: "10px",
              marginRight: "10px",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            <label style={{}}>Rated Books</label>
            <label style={{ fontWeight: "bold", fontSize: "22px" }}>
              {ratingCount}
            </label>
          </Box>
        </Box>
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
        />
      </Popover>

      <Box
        sx={{
          width: "100%",
          height: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          aria-label="My Library Tabs"
          style={{ marginRight: "auto", marginLeft: "70px" }}
        >
          <Tab label="Borrowed" />
          <Tab label="Wishlist" />
          <Tab label="History" />
          <Tab label="Rated" />
        </Tabs>
        <Box role="tabpanel" hidden={value !== 0}>
          {/* Render borrowed books here */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            {books.map((book, index) => (
              <Box
                key={index}
                sx={{
                  width: "180px",
                  height: "250px",
                  margin: "10px",
                  borderRadius: "1spx",
                  overflow: "hidden",
                  justifyContent: "center",
                  ":hover": {
                    backgroundColor:
                      hoveredIndex === index ? "lightgrey" : "transparent",
                  },
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Box
                  sx={{
                    width: "200px",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`data:image/png;base64,${Buffer.from(
                      book.image
                    ).toString("base64")}`}
                    alt={book.title}
                    style={{ width: "130px", height: "180px" }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Typography style={{ fontSize: "15px", fontWeight: "bold" }}>
                    Due Date:{" "}
                  </Typography>
                  <Typography style={{ fontSize: "15px", fontWeight: "bold" }}>
                    {book.end_date}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "14px",
                      marginRight: "10px",
                      color: "grey",
                    }}
                  ></Typography>
                  <Typography
                    style={{
                      fontSize: "14px",
                      color: "red",
                      marginRight: "10px",
                    }}
                  >
                    {book.end_date && today_date
                      ? Math.ceil(
                          (formatDate(book.end_date) - formatDate(today_date)) /
                            (1000 * 60 * 60 * 24)
                        ) >= 0
                        ? `Left ${Math.ceil(
                            (formatDate(book.end_date) -
                              formatDate(today_date)) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : `Overdue ${Math.ceil(
                            (formatDate(today_date) -
                              formatDate(book.end_date)) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                      : ""}
                  </Typography>
                  <Typography
                    style={{ fontSize: "14px", color: "grey" }}
                  ></Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box role="tabpanel" hidden={value !== 1}>
          {wishList &&
            Array.isArray(wishList) &&
            wishList.map((book) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "60px",
                }}
              >
                <Box
                  sx={{
                    width: "90%",
                    height: "auto",
                    margin: "10px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#F4F4F4",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                    paddingLeft: "20px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    paddingRight: "10px",
                  }}
                >
                  <Box>
                    <Typography style={{ fontSize: "12px" }}>
                      {book.title}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "14px",
                        display: "flex",
                        marginBottom: "5px",
                      }}
                    >
                      <span style={{ width: "200px" }}>Author:</span>
                      <span>{book.author}</span>
                    </Typography>
                    {/* <Typography
                      style={{
                        fontSize: "14px",
                        display: "flex",
                        marginBottom: "5px",
                      }}
                    >
                      <span style={{ width: "200px" }}>Publication year:</span>
                      <span>{book.publicationYear}</span>
                    </Typography> */}
                    <Typography style={{ fontSize: "14px", display: "flex" }}>
                      <span style={{ width: "200px" }}>Reason:</span>
                      <span>{book.reason}</span>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
        </Box>

        <Box role="tabpanel" hidden={value !== 2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                marginTop: "130px",
                marginRight: "5px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#2C2C2C",
                  color: "white",
                  width: "37px",
                  height: "37px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={scrollPrev}
              >
                &lt;
              </button>
            </Box>

            <div
              ref={historyContainerRef}
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                padding: "10px",
                scrollBehavior: "smooth",
                width: "90%",
                minHeight: "300px",
                marginBottom: "100px",
                backgroundColor: "#F4F4F4",
                borderRadius: "5px",
              }}
            >
              {books.map((book, index) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: "220px",
                    height: "300px",
                    marginRight: "20px",
                  }}
                >
                  <Box
                    sx={{
                      minWidth: "220px",
                      height: "230px",
                      // backgroundColor: '#F4F4F4',
                      marginRight: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={`data:image/png;base64,${Buffer.from(
                        book.image
                      ).toString("base64")}`}
                      alt={book.title}
                      style={{ width: "150px", height: "200px" }}
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "center" }}
                    key={index}
                  >
                    <Link to="/UserRateBook" state={{ book: book }}>
                      <button
                        onClick={() =>
                          hasRatedBook(book.isbn)
                            ? alert("You have already rated this book.")
                            : navigate("/UserRateBook", { state: { book } })
                        }
                        disabled={hasRatedBook(book.isbn)}
                        style={{
                          width: "70px",
                          height: "25px",
                          backgroundColor: "white",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                          fontSize: "13px",
                          borderRadius: "20px",
                          border: "none",
                          cursor: hasRatedBook(book.isbn)
                            ? "not-allowed"
                            : "pointer",
                          marginLeft: "20px",
                        }}
                      >
                        Rate
                      </button>
                    </Link>
                  </Box>
                </Box>
              ))}
            </div>
            <Box sx={{ marginTop: "130px", marginLeft: "5px" }}>
              <button
                style={{
                  backgroundColor: "#2C2C2C",
                  color: "white",
                  width: "37px",
                  height: "37px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={scrollNext}
              >
                &gt;
              </button>
            </Box>
          </Box>
        </Box>

        <Box role="tabpanel" hidden={value !== 3}>
          {review.map((book, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "60px",
              }}
            >
              <Box
                key={index}
                sx={{
                  width: "90%",
                  height: "150px",
                  margin: "10px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "#F4F4F4",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  paddingTop: "20px",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    sx={{
                      width: "150px",
                      height: "130px",
                      display: "flex",
                      marginRight: "20px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={`data:image/png;base64,${Buffer.from(
                        book.image
                      ).toString("base64")}`}
                      alt={"review-book-cover"}
                      style={{ width: "90px", height: "120px" }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: "10px",
                      }}
                    >
                      <Typography
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        Book Title:
                      </Typography>
                      <Typography style={{ fontSize: "14px" }}>
                        {book.title}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: "10px",
                      }}
                    >
                      <Typography
                        style={{ fontSize: "14px", fontWeight: "bold" }}
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
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        Comment:
                      </Typography>
                      <Typography style={{ fontSize: "14px" }}>
                        {book.comments}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {selectedBook && <UserRateBook book={selectedBook} />}
    </Box>
  );
};

export default MyLibrary;
