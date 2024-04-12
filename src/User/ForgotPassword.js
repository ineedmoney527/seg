//ForgotPassword.js
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  styled,
} from "@mui/material";
import OTPPage from "./OTPPage";
import backPic from "../Image/backpic.png";
import Logo from "../UOSMLogo3.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const buttonStyle = {
  bgcolor: "#242732",
  color: "#fff",
  borderRadius: 5,
  height: 40,
  "&:hover": {
    bgcolor: "#32496B", // Adjust hover background color
    opacity: 5, // Adjust hover opacity as needed
  },
};

const StyledButton = styled(Button)({
  marginTop: "20px",
  background: "#1976d2",
  color: "#fff",
  "&:hover": {
    background: "#135ba1",
  },
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // To show loading indicator
  const [showOTPPage, setShowOTPPage] = useState(false); // To show OTP page
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/");
  };

  const userData = [
    {
      email: "user1@example.com",
      password: "password1",
      lastOldPassword: "oldpassword1",
      otp: "12345",
    },
    {
      email: "user2@example.com",
      password: "password2",
      lastOldPassword: "oldpassword2",
      otp: "54321",
    },
    // Add more dummy data as needed
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/forgot-password`,
        { email }
      );

      if (response.data.success === true) {
        alert(`OTP has been sent to ${email}`);
        navigate("/OTPPage", { state: { email: email } });
      } else {
        // Check for specific error message
        if (response.data.error === "Email not found") {
          alert("Email not found. Please check your email and try again.");
        } else {
          alert(response.data.error); // Display other error messages
        }
      }
    } catch (error) {
      alert("Unexpected error:" + error); // Handle other errors
    }

    setLoading(false); // Stop loading
  };

  // if (showOTPPage) {
  //     return <OTPPage email={email} otp={userData.find((entry) => entry.email === email)?.otp} />;
  // }

  return (
    <Box
      sx={{
        width: "100vw",
        background: "000000",
        backgroundImage: `url(${backPic})`,
        backgroundSize: "cover",
      }}
    >
      <Container component="main" maxWidth="xs">
        {/* <CssBaseline /> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img
            src={Logo}
            alt={"Logo"}
            style={{
              width: "350px",
              height: "100px",
              marginBottom: "30px",
              marginTop: "-20px",
              filter: "brightness(0) invert(1) contrast(5)",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "45vh",
              width: "35vw",
              borderRadius: 5,
              borderWidth: 1, // Set the border width
              borderColor: "#ffffff", // Set the border color if needed
              borderStyle: "solid",
              backdropFilter: "blur(50px) opacity(0.1)",
              backgroundColor: "rgba(157, 210, 231, 0.2)",
              //   background: "#fff000"
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              fontWeight={"bold"}
              sx={{ fontSize: 60 }}
            >
              👀
            </Typography>
            <Typography
              component="h1"
              variant="h5"
              fontWeight={"bold"}
              sx={{ fontSize: 40 }}
            >
              Forget Password
            </Typography>
            {/* <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}> */}
            <form onSubmit={handleSubmit} sx={{ mt: 3, borderRadius: 30 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: 300, borderRadius: 30 }}
              />
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, ...buttonStyle }} // Spread the buttonStyle object within the sx prop
                disabled={loading} // Disable button while loading
              >
                {loading ? "Sending..." : "Sending OTP"}
              </StyledButton>
              {/* </Box> */}
            </form>
            <Typography
              sx={{
                textDecoration: "underline",
                color: "blue",
                cursor: "pointer",
                marginTop: 3,
              }}
              onClick={handleLoginClick}
            >
              Back To Login
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
