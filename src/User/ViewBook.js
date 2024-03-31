import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import Rating from "@mui/material/Rating";
import icon from "../Image/review-icon.png";
import { Buffer } from "buffer";
const ViewBook = () => {
  const [open, setOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [countdown, setCountdown] = useState(259200);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const location = useLocation();
  const { book } = location.state || {};

  useEffect(() => {
    let timer;
    if (reserved) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            clearInterval(timer);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [reserved]);

  const handleClickReserved = () => {
    setReserved(true);
    setCountdown(259200);
  };

  const cancelReservation = () => {
    setReserved(false);
  };

  const days = Math.floor(countdown / (24 * 60 * 60));
  const hours = Math.floor((countdown % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((countdown % (60 * 60)) / 60);
  const seconds = countdown % 60;

  if (!book) {
    return <div>No book data available</div>;
  }

  const sampleReview = [
    {
      user: "John",
      image: icon,
      rating: 5,
      review: "This book is amazing! Highly recommended.",
    },
    {
      user: "YiKiat",
      image: icon,
      rating: 4,
      review: "One of the best books I've ever read!",
    },
    {
      user: "Xin Win",
      image: icon,
      rating: 3,
      review: "ok.",
    },
  ];

  return (
    <Layout
      showSearchBar={showSearchBar}
      toggleDrawer={toggleDrawer}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "35px",
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: "25px", fontWeight: "Bold", fontFamily: "Alata" }}
            gutterBottom
          >
            {book.title}
          </Typography>
          <Typography
            sx={{ fontSize: "15px", color: "#626262" }}
            variant="body1"
            gutterBottom
          >
            Description: {book.description}
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
          >
            <Box sx={{ marginRight: "200px" }}>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
                gutterBottom
              >
                Author: {book.author_name}
              </Typography>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
                gutterBottom
              >
                Publication Year: {book.publish_year}
              </Typography>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
                gutterBottom
              >
                Total Page: {book.pages}
              </Typography>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
                gutterBottom
              >
                Rating: {book.rating}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
                gutterBottom
              >
                Genre: {book.genre}
              </Typography>

              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
                gutterBottom
              >
                Location:{book.location}
              </Typography>
            </Box>
          </Box>
          {/*Add more details as needed */}
        </Box>
        <Box
          sx={{
            marginTop: "auto",
            marginBottom: "auto",
            display: "flex",
            flexDirection: "column",
            marginLeft: "auto",
          }}
        >
          <img
            src={`data:image/png;base64,${Buffer.from(book.image).toString(
              "base64"
            )}`}
            alt={"book-cover"}
            style={{ width: "120px", height: "200px" }}
          />
          {!reserved && (
            <button
              onClick={handleClickReserved}
              style={{
                width: "120px",
                height: "25px",
                borderRadius: "5px",
                backgroundColor: "#5DBD72",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              Reserve
            </button>
          )}
          {reserved && (
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={cancelReservation}
                style={{
                  width: "120px",
                  height: "25px",
                  borderRadius: "5px",
                  backgroundColor: "#FF5733",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  fontSize: "12px",
                }}
              >
                Cancel Reservation
              </button>
              <div>{`Reserved (${days}d ${hours}h ${minutes}m ${seconds}s left)`}</div>
            </div>
          )}
        </Box>
      </Box>

      <Box>
        <label
          style={{
            display: "flex",
            width: "80%",
            fontWeight: "Bold",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "80px",
            fontSize: "18px",
            fontFamily: "Alata",
          }}
        >
          Reviews
        </label>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            height: "300px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10px",
            backgroundColor: "transparent",
            border: "1px solid black",
            borderRadius: "10px",
            overflowY: "auto",
          }}
        >
          {sampleReview.map((review, index) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                height: "auto",
                minHeight: "80px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "25px",
                marginBottom: "8px",
                backgroundColor: "#ECECEC",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box sx={{ marginLeft: "10px" }}>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <img
                    src={review.image}
                    alt={"review-icon"}
                    style={{ width: "25px", height: "25px" }}
                  />
                  <label
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      overflow: "hidden",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginLeft: "10px",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    {review.user}
                  </label>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ marginRight: "5px" }}>
                    Rating:
                  </Typography>
                  <Rating
                    name="read-only"
                    value={parseFloat(review.rating)}
                    readOnly
                    precision={0.5}
                  />
                </Box>
                <Typography
                  sx={{ fontSize: "14px" }}
                  variant="body1"
                  gutterBottom
                >
                  {review.review}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default ViewBook;
