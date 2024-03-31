import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import { useForm } from "react-hook-form";
import Rating from "@mui/material/Rating";

const UserRateBook = () => {
  const [open, setOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const location = useLocation();
  const { book } = location.state || {};

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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
                Author: {book.author}
              </Typography>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
                gutterBottom
              >
                Publication Year: {book.publicationYear}
              </Typography>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="body2"
                gutterBottom
              >
                Total Page: {book.totalPages}
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
                Courses: {book.courses}
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
            src={book.imgPath}
            alt={"book-cover"}
            style={{ width: "120px", height: "200px" }}
          />
        </Box>
      </Box>

      <Box>
        <label
          style={{
            display: "flex",
            width: "80%",
            fontWeight: "bold",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "80px",
            fontSize: "18px",
            fontFamily: "Alata",
          }}
        >
          Rating
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
            marginBottom: "50px",
            backgroundColor: "#ECECEC",
            border: "1px solid black",
            borderRadius: "10px",
            overflowY: "auto",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <label
                style={{
                  fontSize: "15px",
                  marginRight: "20px",
                  marginLeft: "20px",
                }}
              >
                Rating:
              </label>
              {/* Register input field with React Hook Form */}
              <Rating {...register("rating")} name={"rating"} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label
                style={{
                  fontSize: "15px",
                  marginLeft: "20px",
                  marginTop: "20px",
                }}
              >
                Comments:
              </label>
              {/* Register input field with React Hook Form */}
              <input
                {...register("comments")}
                type="text"
                placeholder={"Share your book experiences..."}
                style={{
                  width: "850px",
                  height: "130px",
                  borderRadius: "5px",
                  marginLeft: "20px",
                  marginTop: "20px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  textAlign: "left",
                }}
              />
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <button
                type="submit"
                style={{
                  width: "100px",
                  height: "30px",
                  borderRadius: "5px",
                  backgroundColor: "#0F2A50",
                  border: "none",
                  color: "white",
                }}
              >
                Submit
              </button>
            </Box>
          </form>
        </Box>
      </Box>
    </Layout>
  );
};

export default UserRateBook;
