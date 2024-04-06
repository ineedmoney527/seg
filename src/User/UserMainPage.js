import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { Link, useNavigate } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Layout from "./Layout";
import axios from "axios";
import ViewBook from "./ViewBook";
import { Buffer } from "buffer";
import librarian from "../Image/librarian.png";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function SwipeableTextMobileStepper({ books }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = books.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const renderCell = (params) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        resolve(base64String);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(new Blob([params.value]));
    });
  };

  const loadImages = async (books) => {
    // Map each book to a Promise that loads its image
    const promises = books.map(async (step) => {
      try {
        // Load the image for this book
        return await renderCell(step);
      } catch (error) {
        console.error("Error loading image:", error);
        return null; // Return null if an error occurs
      }
    });

    // Wait for all promises to resolve
    return Promise.all(promises);
  };

  // Inside your component function
  // const [images, setImages] = useState([]);

  // useEffect(() => {
  //   // Load images when component mounts
  //   loadImages(books)
  //     .then((loadedImages) => {
  //       // Update state with the loaded images
  //       setImages(loadedImages);
  //     })
  //     .catch((error) => {
  //       console.error("Error loading images:", error);
  //     });
  // }, [books]);

  return (
    <Box
      sx={{
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {books.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  width: "980px",
                  height: "45vh",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  marginTop: "20px",
                  marginBottom: "20px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "30vh",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                    marginBottom: "20px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      height: "auto",
                      width: "100%",
                      maxHeight: "150px",
                      maxWidth: "120px",
                      mb: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                    src={`data:image/png;base64,${Buffer.from(
                      step.image
                    ).toString("base64")}`}
                    // alt={step.label}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "20px",
                    }}
                  >
                    <Typography sx={{ fontWeight: "Bold", fontSize: "15px" }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ fontSize: "12px" }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    marginLeft: "auto",
                    marginRight: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "#0F2A50",
                      width: "100px",
                      height: "30px",
                      fontSize: "12px",
                    }}
                    startIcon={<VisibilityIcon />}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        sx={{ backgroundColor: "transparent" }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}

export default function UserMainPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [showBookList, setShowBookList] = useState(false);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/book");
      console.log(response);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prevShowSearchBar) => !prevShowSearchBar);
  };

  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const [selectedBook, setSelectedBook] = useState(null);

  const handleViewBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleBookListClick = () => {
    navigate("/BookList");
    setShowBookList(true);
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/UserMainPage")
  //     .then((response) => {
  //       setBooks(response.data.books);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching book data:", error);
  //     });
  // }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout
      showSearchBar={showSearchBar}
      toggleSearchBar={toggleSearchBar}
      toggleDrawer={toggleDrawer}
      open={open}
    >
      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          Recommended Books
        </Typography>
      </Box>
      <SwipeableTextMobileStepper books={books} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "auto",
          width: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "5px",
            width: "33%",
            minHeight: "80px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "10px",
              fontSize: "18px",
            }}
          >
            Today, {currentDate.toLocaleDateString()}
          </Typography>
          <Box>
            <Box sx={{ marginBottom: "10px", fontSize: "18px" }}>
              <label>Central Library</label>
            </Box>
            <Box sx={{ marginBottom: "10px", fontSize: "14px" }}>
              <label>Operation: OPEN</label>
            </Box>
            <Box sx={{ marginBottom: "10px", fontSize: "14px" }}>
              <label>Operating Hours: 09:00a.m. - 6:00p.m.</label>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            marginTop: "20px",
            marginLeft: "100px",
            borderRadius: "5px",
            width: "32%",
            minHeight: "80px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box>
              <img
                src={librarian}
                alt={"librarian-icon"}
                style={{ minWidth: "100px", minHeight: "100px" }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "20px",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  fontSize: "18px",
                }}
              >
                Librarian On-Duty
              </Typography>
              <label>Ms Afiqah</label>
              <label>afiqah@soton.ac.uk</label>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "85%",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "20px",
        }}
      >
        <Box sx={{ marginRight: "auto" }}>
          <label style={{ fontSize: "25px", fontWeight: "bold" }}>
            All Books
          </label>
        </Box>
        <Box>
          <Button
            size="small"
            sx={{
              width: "110px",
              height: "30px",
              color: "#0F2A50",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: "#0F2A50",
                color: "white",
              },
            }}
            startIcon={<ExpandMoreIcon />}
            onClick={handleBookListClick}
          >
            See All
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "89%",
          flexDirection: "column",
          marginLeft: "auto",
          marginRight: "auto",
          height: "500px",
          overflow: "auto",
          backgroundColor: "#EFEEEE",
          marginBottom: "50px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
        }}
      >
        {books.map(
          (book, index) =>
            index % 5 === 0 && (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  paddingTop: "20px",
                }}
              >
                {books.slice(index, index + 5).map((bookInRow, idx) => (
                  <ListItem key={index + idx}>
                    <Box
                      sx={{
                        paddingTop: "10px",
                        width: "180px",
                        height: "250px",
                        display: "flex",
                        flexDirection: "column",

                        ":hover": {
                          backgroundColor:
                            hoveredIndex === index + idx
                              ? "#D8D8D8"
                              : "transparent",
                          cursor: "pointer",
                        },
                      }}
                      onMouseEnter={() => handleMouseEnter(index + idx)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Box
                        sx={{
                          width: "180px",
                          height: "180px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Link to="/ViewBook" state={{ book: bookInRow }}>
                          <img
                            src={`data:image/png;base64,${Buffer.from(
                              bookInRow.image
                            ).toString("base64")}`}
                            alt={bookInRow.label}
                            style={{
                              width: "130px",
                              height: "190px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleViewBookClick(bookInRow)}
                          />
                        </Link>
                      </Box>
                      <Box
                        sx={{
                          width: "180px",
                          height: "70px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: "14px",
                            textAlign: "center",
                            color: "#0B1D35",
                          }}
                        >
                          {bookInRow.title}
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "12px",
                            textAlign: "center",
                            color: "grey",
                          }}
                        >
                          {bookInRow.author_name}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </Box>
            )
        )}
        {selectedBook && <ViewBook book={selectedBook} />}
      </Box>
    </Layout>
  );
}
