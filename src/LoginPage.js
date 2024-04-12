import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useSignIn, useAuthUser } from "react-auth-kit";
import {
  Box,
  Button,
  Typography,
  Container,
  CssBaseline,
  TextField,
  styled,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import Logo from "./UOSMLogo3.png";

// import background from "./UoSM Background.jpg";

const buttonStyle = {
  bgcolor: "#242732",
  color: "#fff",
  borderRadius: 5,
  height: 50,
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

const LoginPage = () => {
  const [username, setUsername] = useState("sc121@soton.ac.uk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signIn = useSignIn();

  const handleForgotClick = () => {
    navigate("/ForgotPassword");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", { username, password });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { username, password }
      );

      if (response.data.success) {
        const token = response.data.token;
        const user = response.data.user; // Assuming your API returns the user's information in the response

        signIn({
          token: token,
          expiresIn: 1000,
          tokenType: "Bearer",
          authState: user,
          // Set the token in the cookie
          cookie: {
            name: "_auth",
            domain: window.location.hostname,
            secure: window.location.protocol === "https:",
            path: "/",
          },
        });

        // Access the user's information from the authState
        if (user.role_id === 1) {
          navigate("/admin");
        } else if (user.role_id === 2) {
          navigate("/WithNavigate");
        } else {
          navigate("/UserMainPage");
        }
      } else {
        console.log(response.data.message);
        setError(response.data.message || "Login failed.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        console.log("Full error object:", error);
        setError("An error occurred. Please try again.");
      }
    }
  };
  return (
    <div className="Login_container">
      {/*<img src={background} alt={"container"} className={"container"}/>*/}
      <div className="Login_form-container">
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
            className="Logo-loginPage"
            style={{
              width: "450px",
              height: "120px",
              marginBottom: "30px",
              marginTop: "-20px",
              filter: "brightness(0) invert(1) contrast(5)",
            }}
          />
          <Stack
            direction={"column"}
            spacing={3}
            justifyContent={"space-between"}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              width: "30vw",
              borderRadius: 5,
              borderWidth: 1, // Set the border width
              borderColor: "#ffffff", // Set the border color if needed
              borderStyle: "solid",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(67, 79, 100, 0.2)",
              // backgroundColor: "rgba(102, 117, 144, 0.2)",
            }}
          >
            <h1 className="loginheader">Login</h1>
            <form onSubmit={handleSubmit} className="formSubmit">
              <div className="Login_form-group">
                <label className="Login_label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={"Enter Username"}
                  className="Login_input"
                />
              </div>
              <div className="Login_form-group">
                <label className="Login_label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={"Enter Password"}
                  className="Login_input"
                />
                {error && <p className="Login_error">{error}</p>}
              </div>
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ ...buttonStyle }} // Use double curly braces and spread operator to pass the buttonStyle object
              >
                Login
              </StyledButton>

              <Stack
                direction={"row"}
                spacing={3}
                sx={{ marginTop: 2 }}
                justifyContent={"space-between"}
              >
                <Box sx={{ marginRight: 2, color: "white" }}>
                  Forgot Password?
                </Box>
                <Typography
                  sx={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                    marginLeft: 4,
                  }}
                  onClick={handleForgotClick}
                >
                  Click here
                </Typography>
              </Stack>
            </form>
          </Stack>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
