import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import { useForm, Controller } from "react-hook-form";
import { useAuthUser } from "react-auth-kit";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const UserRateBook = () => {
  const [open, setOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const user_id = useAuthUser()().id;
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const location = useLocation();
  const { book } = location.state || {};
  const navigate = useNavigate();
  const ratingSchema = z.object({
    rating: z.number().min(0).max(5),
    comments: z
      .string()
      .nonempty({ message: "Comments field cannot be empty" })
      .max(255),
  });
  const {
    register,
    handleSubmit,
    control,

    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ratingSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/book/rating",
        {
          rating: data.rating,
          comments: data.comments,
          userId: user_id,
          isbn: book.isbn,
        }
      );
      alert("Added Successfully");
      navigate("/UserMyLibrary");
      console.log(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
                Courses: {book.courses}
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
            src={`data:image/png;base64,${Buffer.from(book.image).toString(
              "base64"
            )}`}
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
              <Controller
                name="rating"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Rating
                    {...field}
                    precision={0.5}
                    onChange={(event, newValue) => field.onChange(newValue)}
                  />
                )}
              />{" "}
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
              {errors.comments && (
                <span style={{ color: "red", marginLeft: "20px" }}>
                  {errors.comments.message}
                </span>
              )}
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
