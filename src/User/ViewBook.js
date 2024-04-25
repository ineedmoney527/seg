import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import Rating from "@mui/material/Rating";
// import AlertIcon from '@mui/icons-material/Alert';
import icon from "../Image/review-icon.png";
import { Buffer } from "buffer";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import {
  useSignIn,
  useAuthUser,
  useAuthHeader,
  useIsAuthenticated,
  useSignOut,
} from "react-auth-kit";
import { set } from "date-fns";
const ViewBook = () => {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [timer, setTimer] = useState(null);
  const [pending, setPending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const location = useLocation();
  const { book } = location.state || {};

  // Add this function to format the time
  const formatTime = (time) => {
    const days = Math.floor(time / (24 * 60 * 60 * 1000));
    const hours = Math.floor((time % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // useEffect(() => {
  //   let timer = null;
  //   if (reserved && countdown > 0) {
  //     timer = setInterval(() => {
  //       setCountdown((prevCountdown) => prevCountdown - 1);
  //     }, 1000);
  //   }

  //   return () => clearInterval(timer);
  // }, [reserved, countdown]);
  const fetchReviews = async () => {
    const response = await axios.get(
      "http://localhost:5000/api/history/reviewByBook/" + book.isbn
    );

    setReview(response.data.data);
    console.log(review);
  };
  useEffect(() => {
    // Start the timer if reserved and countdown is greater than 0
    if (reserved && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1000);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setReserved(false);
    }
  }, [countdown]);
  useEffect(() => {
    console.log(book);
    checkAvailabilityAndReservation();
    fetchReviews();

    return () => null;
  }, []);
  const checkAvailability = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/book/checkAvailable/" + book.isbn
      );

      setAvailability(response.data); // Set the availability response in state
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  const user_id = useAuthUser()().id;
  const bookingLimit = useAuthUser()().id;
  const checkAvailabilityAndReservation = async () => {
    checkAvailability();
    checkReservation();
    checkPending();
  };

  const checkReservation = async () => {
    try {
      console.log(book.isbn);
      console.log(user_id);
      const response = await axios.get(
        `http://localhost:5000/api/reserve/checkReservation/${book.isbn}/${user_id}`
      );
      console.log(response.data);
      if (
        response.data?.valid_book_codes &&
        response.data.valid_book_codes.length > 0
      ) {
        console.log(response.data?.valid_book_codes);
        setReserved(true);
        console.log("haha");
        // Start the countdown timer if there's remaining time
        const endTime = new Date(response.data.end_datetime).getTime();
        const currentTime = new Date().getTime();
        const remainingTime = Math.max(0, endTime - currentTime);

        setCountdown(remainingTime); // Set the countdown directly
      } else {
        setReserved(false);
        setCountdown(0); // Reset countdown if there's no reservation
      }
    } catch (error) {
      console.error("Error fetching reservation status:", error);
    }
  };

  const checkPending = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reserve/checkPending/${book.isbn}/${user_id}`
      );

      if (response.data.message === "true") {
        console.log("haha");
        setPending(true);
      }
    } catch (e) {
      console.log("Error" + e);
    }
  };

  useEffect(() => {
    console.log("is reserved: ", reserved);
    // ...
  }, [reserved]);
  const handleClickReserved = async () => {
    const currentTimestamp = new Date();
    const oneDayLater = new Date();
    oneDayLater.setDate(oneDayLater.getDate() + 1);
    //get a book of this isbn
    try {
      const firstBook = await axios.get(
        "http://localhost:5000/api/book/" + book.isbn
      );
      const limitResponse = await axios.get(
        "http://localhost:5000/api/user/limit/" + user_id
      );

      const currentLimit = limitResponse.data.borrow_limit;
      const updatedLimit = currentLimit - 1;
      if (updatedLimit < 0) {
        alert("Exceeded Borrow Limit!");
        return;
      }
      //deduct limit
      await axios.put("http://localhost:5000/api/user/limit", {
        id: user_id,
        limit: updatedLimit,
      });
      //update state to pending
      const response = await axios.post("http://localhost:5000/api/reserve", {
        status: "Pending",
        book_code: firstBook.data.book_code,
        requested_at: currentTimestamp,
        user_id: user_id,
      });
      alert(response.data.message);

      setPending(true);
    } catch (e) {
      alert(e.message);
    }
  };
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const cancelReservation = async () => {
    try {
      const deleteResponse = await axios.delete(
        `http://localhost:5000/api/reserve/${book.isbn}/${user_id}`
      );

      const limitResponse = await axios.get(
        "http://localhost:5000/api/user/limit/" + user_id
      );

      const currentLimit = limitResponse.data.borrow_limit;

      const updatedLimit = currentLimit + 1;

      axios.put("http://localhost:5000/api/user/limit", {
        id: user_id,
        limit: updatedLimit,
      });

      if (deleteResponse.data) {
        alert(deleteResponse.data.message);
      } else {
        console.error("Error in deleteResponse: invalid response format");
      }
      //add back borrow limit

      setPending(false);
      setReserved(false);
    } catch (e) {
      console.error("Error in cancelReservation:", e.message);
    }
  };

  if (!book) {
    return <div>No book data available</div>;
  }

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
          width: "90%",
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
              <Typography sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="body2"
                  gutterBottom
                >
                  ISBN:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {book.isbn}
                </Typography>
              </Typography>
              <Typography sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="body2"
                  gutterBottom
                >
                  Author:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {book.author_name}
                </Typography>
              </Typography>
              <Typography sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="body2"
                  gutterBottom
                >
                  Total Page:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {book.pages}
                </Typography>
              </Typography>

              <Typography sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="body2"
                  gutterBottom
                >
                  Rating:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {book.rating ? book.rating : "Not yet rated"}
                </Typography>
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="body2"
                  gutterBottom
                >
                  Publication Year:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {book.publish_year}
                </Typography>
              </Typography>

              <Typography sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="body2"
                  gutterBottom
                >
                  Country:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {book.country_name}
                </Typography>
              </Typography>

              <Typography sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="body2"
                  gutterBottom
                >
                  Call Number:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {book.call_number}
                </Typography>
              </Typography>

              <Typography sx={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  variant="body2"
                  gutterBottom
                >
                  Location:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {book.location}
                </Typography>
              </Typography>
            </Box>{" "}
          </Box>
          <Box
            sx={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
          >
            <label style={{ color: "grey", marginRight: "5px" }}>
              you can search for E-books from
            </label>
            <label style={{ color: "blue" }}>
              https://www.southampton.ac.uk/library/index.page
            </label>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: "auto",
            marginBottom: "auto",
            display: "flex",
            flexDirection: "column",
            marginLeft: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`data:image/png;base64,${Buffer.from(book.image).toString(
              "base64"
            )}`}
            alt={"book-cover"}
            style={{ width: "120px", height: "200px" }}
          />
          {!reserved && !pending && (
            <button
              disabled={!availability}
              onClick={handleClickReserved}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                width: "120px",
                height: "25px",
                borderRadius: "2px",
                backgroundColor: isHovered
                  ? availability
                    ? "#4CAF50"
                    : "#CCCCCC"
                  : availability
                  ? "#5DBD72"
                  : "#CCCCCC",
                // backgroundColor: availability ? "#5DBD72" : "#CCCCCC",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
                // ":hover": {
                //   backgroundColor: isHovered ? "#4CAF50" : availability ? "#5DBD72" : "#CCCCCC",
                // }
              }}
            >
              {availability ? "Make Reservation" : "Unavailable"}
            </button>
          )}
          {pending && (
            <div
              style={{
                marginTop: "10px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      marginRight: "7px",
                      animation: "blink 1s infinite", // Apply the blink animation
                      fontSize: "24px",
                    }}
                  >
                    ⚠️ {/* Render an alert emoji */}
                  </div>
                </div>
                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Reservation Pending
                </label>
                {/* Define the blink animation */}
                <style>
                  {`
        @keyframes blink {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}
                </style>
              </div>

              <button
                onClick={cancelReservation}
                style={{
                  width: "120px",
                  height: "25px",
                  borderRadius: "5px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
                  fontSize: "12px",
                }}
              >
                Cancel Reservation
              </button>
            </div>
          )}
          {reserved && (
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={cancelReservation}
                style={{
                  width: "120px",
                  height: "25px",
                  borderRadius: "5px",

                  backgroundColor: "grey",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "10px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  fontSize: "12px",
                }}
              >
                Reserved
              </button>
              <div>{`(${formatTime(countdown)})`}</div>
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
            width: "90%",
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
          {review?.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "90%",
                height: "80px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "25px",
                marginBottom: "8px",
                backgroundColor: "#ECECEC",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography variant="body1">No review</Typography>
            </Box>
          ) : (
            review?.map((review, index) => (
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
                      src={`data:image/png;base64,${Buffer.from(
                        review.image_file
                      ).toString("base64")}`}
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
                      {review.name}
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
                    {review.comments}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default ViewBook;
