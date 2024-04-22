import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useForm } from "react-hook-form";
import Layout from "./Layout";
import bg from "../Image/BookPostCard.png";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { useAuthUser } from "react-auth-kit";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

import axios from "axios";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function SlideShow({ requests }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const maxSteps = requests.length;

  // Check if requests array is undefined or empty
  if (!requests || requests.length === 0) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <p>No requests available.</p>
      </Box>
    );
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          width: "60%",
          height: "90vh",
          maxWidth: "none",
          maxHeight: "none",
          marginBottom: "20px",
        }}
      >
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {requests.map((item, index) => (
            <Box key={index}>
              <Box
                sx={{
                  width: "80%",
                  height: "80%",
                  paddingTop: "80px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "20px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "10px",
                    }}
                  >
                    <label>Title:</label>
                    <label
                      style={{
                        width: "100%",
                        height: "5vh",
                        backgroundColor: "#EFEFEF",
                        color: "#525252",
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        paddingLeft: "10px",
                        paddingTop: "5px",
                      }}
                    >
                      {item.title}
                    </label>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "10px",
                    }}
                  >
                    <label>Author:</label>
                    <label
                      style={{
                        width: "100%",
                        height: "5vh",
                        backgroundColor: "#EFEFEF",
                        color: "#525252",
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        paddingLeft: "10px",
                        paddingTop: "5px",
                      }}
                    >
                      {item.author}
                    </label>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "10px",
                    }}
                  >
                    <label>Edition:</label>
                    <label
                      style={{
                        width: "100%",
                        height: "5vh",
                        backgroundColor: "#EFEFEF",
                        color: "#525252",
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        paddingLeft: "10px",
                        paddingTop: "5px",
                      }}
                    >
                      {item.edition}
                    </label>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <label>Reason:</label>
                    <label
                      style={{
                        width: "100%",
                        height: "22vh",
                        backgroundColor: "#EFEFEF",
                        color: "#525252",
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        paddingLeft: "10px",
                        paddingTop: "5px",
                      }}
                    >
                      {item.reason}
                    </label>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </AutoPlaySwipeableViews>
      </Box>
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
const UserBookRequest = () => {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(true);
  const user_id = useAuthUser()().id;
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prevShowSearchBar) => !prevShowSearchBar);
  };

  const handleAddRequest = () => {
    setAddOpen(true);
  };

  const handleClose = () => {
    setAddOpen(false);
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/request/add", {
        ...data,
        user_id: user_id,
      })
      .then((response) => {
        console.log("Book request added successfully:", response.data);
        alert("Book request added successfully");
        setAddOpen(false);
        // reset();
      })
      .catch((error) => {
        console.error("Error adding book request:", error);
        // Check if the error is due to request already existing
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data &&
          error.response.data.message === "Request already exists"
        ) {
          alert("Request already exists");
        }
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/request")
      .then((response) => {
        console.log("Response from backend:", response.data);
        setRequests(response.data.requests);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout
      showSearchBar={showSearchBar}
      toggleSearchBar={toggleSearchBar}
      toggleDrawer={toggleDrawer}
      open={open}
    >
      <Box sx={{ backgroundColor: "#F6F4F1" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "timesnewroman",
            height: "100px",
          }}
        >
          <label
            style={{
              display: "flex",
              fontSize: "45px",
              fontWeight: "bold",
              color: "#2868C6",
            }}
          >
            Monthly Wish List
          </label>
        </Box>
        <Divider
          sx={{
            width: "50%",
            marginBottom: "20px",
            borderBottom: "1px solid black",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        {!loading && requests.length > 0 && <SlideShow requests={requests} />}
        {/*<SlideShow requests={requests}/>*/}

        <Box
          sx={{
            display: "flex",
            marginTop: "10px",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Button
            onClick={handleAddRequest}
            sx={{
              backgroundColor: "#183764",
              color: "white",
              width: "200px",
              height: "30px",
              "&:hover": {
                backgroundColor: "#2468CD",
                color: "white",
              },
            }}
          >
            Add My Wish
          </Button>
        </Box>
      </Box>
      <Dialog
        open={addOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            width: "60%",
            height: "90%",
            maxWidth: "none",
            maxHeight: "none",
          },
        }}
      >
        <DialogContent
          sx={{
            width: "80%",
            height: "80%",
            marginTop: "90px",
            marginBottom: "20px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <DialogContentText>
            Please provide details about the book you want to request.
          </DialogContentText>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "20px",
                width: "100%",
                height: "100%",
              }}
            >
              <label>Title:</label>
              <input
                {...register("title", {
                  required: "Title is required", // Error message for required field
                })}
                type="text"
                style={{ width: "100%", minHeight: "5vh" }}
                autoComplete="off"
              />
              {errors.title && (
                <p style={{ color: "red" }}>{errors.title.message}</p>
              )}{" "}
              {/* Display error */}
              <label>Author:</label>
              <input
                {...register("author", {
                  required: "Author is required",
                })}
                type="text"
                style={{ width: "100%", height: "5vh" }}
                autoComplete="off"
              />
              {errors.author && (
                <p style={{ color: "red" }}>{errors.author.message}</p>
              )}
              <label>Edition:</label>
              <input
                {...register("edition", {
                  required: "Edition is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Please enter a valid edition number",
                  },
                })}
                type="number"
                min={0}
                style={{
                  width: "100%",
                  height: "5vh",
                }}
                autoComplete="off"
              />
              {errors.edition && (
                <p style={{ color: "red" }}>{errors.edition.message}</p>
              )}
              <label>Publisher:</label>
              <input
                {...register("publisher", {
                  required: "Publisher is required",
                })}
                type="text"
                style={{
                  width: "100%",
                  height: "5vh",
                }}
                autoComplete="off"
              />
              {errors.publisher && (
                <p style={{ color: "red" }}>{errors.publisher.message}</p>
              )}
              <label>Reason:</label>
              <input
                {...register("reason", {
                  required: "Reason is required",
                })}
                type="text"
                style={{ width: "100%", height: "17vh", borderRadius: "10px" }}
                autoComplete="off"
              />
              {errors.reason && (
                <p style={{ color: "red" }}>{errors.reason.message}</p>
              )}
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserBookRequest;
