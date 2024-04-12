//OTPPage.js
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import "./OTPPage.css";
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
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import backPic from "../Image/backpic.png";
import Logo from "../UOSMLogo3.png";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { z } from "zod";

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

function OTPPage() {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [verifiedOTP, setVerifiedOTP] = useState(false);
  const [password, setPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const schema = z
    .object({
      password: z
        .string()
        .min(8)
        .refine((val) => /[a-z]/.test(val), {
          message: "Password must include at least one lowercase letter",
        })
        .refine((val) => /[A-Z]/.test(val), {
          message: "Password must include at least one uppercase letter",
        })
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
          message: "Password must include at least one special character",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors: errors },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm({ resolver: zodResolver(schema) });
  // const { state: { email, otp } } = useLocation();
  const { email } = location.state || {};

  const handleForgotClick = () => {
    navigate("/ForgotPassword");
  };

  const handleResendOTP = async () => {
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
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const handleVerifyOTP = handleSubmit((data, event) => {
  //   // Prevent default form submission action
  //   event.preventDefault();

  //   const otpDigits = [];
  //   for (let i = 1; i <= 5; i++) {
  //     otpDigits.push(data[`otp-${i}`] || ''); // Push each OTP digit value or empty string if not entered
  //   }
  //   const enteredOTP = otpDigits.join(''); // Concatenate OTP digits into a single string

  //   console.log("Input OTP:", enteredOTP);
  //   console.log("Expected OTP:", otp);

  //   // Your OTP verification logic here using enteredOTP
  //   if (enteredOTP === otp) {
  //     setVerifiedOTP(true);
  //   } else {
  //     alert("Incorrect OTP. Please try again.");
  //   }

  // });

  const handleVerifyOTP = handleSubmit(async (data, event) => {
    console.log(email);
    // Prevent default form submission action
    event.preventDefault();

    const otpDigits = [];
    for (let i = 1; i <= 5; i++) {
      otpDigits.push(data[`otp-${i}`] || ""); // Push each OTP digit value or empty string if not entered
    }
    const enteredOTP = otpDigits.join(""); // Concatenate OTP digits into a single string
    console.log("ss" + enteredOTP);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/verify-otp`,
        { email: email, otp: enteredOTP }
      );

      if (response.data.success === true) {
        alert(`OTP Verified Successfully`);
        setVerifiedOTP(true);
      } else {
        // Check for specific error message
        if (response.data.error === "Invalid OTP or OTP expired") {
          alert("Invalid OTP or OTP expired.");
        } else {
          alert(response.data.error); // Display other error messages
        }
      }
    } catch (error) {
      alert("Unexpected error:" + error); // Handle other errors
    }
  });

  const handleResetPassword = handleSubmit2(async (data, event) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/reset-password`,
        { email: email, newPassword: data.password }
      );

      if (response.data.success === true) {
        alert(`Password Reset Successfully,Redirecting to Login page...`);

        navigate("/"); // Redirect to the login page
      } else {
        // Check for specific error message
        alert(response.data.error); // Display other error messages
      }
    } catch (e) {
      alert("Unexpected error:" + e); // Handle other errors
    }
  });

  const handleKeyDown = (index, event) => {
    if (event.code === "Backspace") {
      // Clear current and previous input boxes
      if (index > 0) {
        const currentInput = document.getElementById(`otp-${index}`);
        const prevInput = document.getElementById(`otp-${index - 1}`);

        if (currentInput && prevInput) {
          currentInput.value = "";
          prevInput.value = "";
          prevInput.focus();
        }
      }
    }
  };

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
        <CssBaseline />
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
              height: "60vh",
              width: "40vw",
              borderRadius: 5,
              borderWidth: 1, // Set the border width
              borderColor: "#ffffff", // Set the border color if needed
              borderStyle: "solid",
              backdropFilter: "blur(50px) opacity(0.1)",
              backgroundColor: "rgba(157, 210, 231, 0.2)",
              //   background: "#fff000"
            }}
            F
          >
            {verifiedOTP ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: 40 }}
                >
                  🫣
                </Typography>
                <Typography
                  component="h1"
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: 40 }}
                >
                  Reset Password
                </Typography>
                <Box component="form" sx={{ mt: 3 }}>
                  <form onSubmit={handleResetPassword}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      {...register2("password")}
                      placeholder="New Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {errors2.password && (
                      <span className="error">{errors2.password.message}</span>
                    )}

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      {...register2("confirmPassword")}
                      placeholder="Confirm Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {errors2.confirmPassword && (
                      <span className="error">
                        {errors2.confirmPassword.message}
                      </span>
                    )}
                    <StyledButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={buttonStyle}
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </StyledButton>
                  </form>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100vw",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                {/* //, background: "#ff0000" */}
                <Typography
                  component="h1"
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: 60 }}
                >
                  🕶️
                </Typography>
                <Typography
                  component="h1"
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: 55 }}
                >
                  Verify
                </Typography>
                <Typography component="h1" variant="h6" sx={{ fontSize: 20 }}>
                  The code was sent to you via email, please enter the code:
                </Typography>
                {/* <Box component="form" > */}
                {/* <form
                  onSubmit={handleVerifyOTP}
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                > */}
                <Box display="flex" justifyContent="center" alignItems="center">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <TextField
                      key={index}
                      margin="normal"
                      required
                      id={`otp-${index}`}
                      name={`otp-${index}`}
                      type="text"
                      inputProps={{
                        style: { textAlign: "center" },
                      }}
                      style={{
                        width: 50,
                        marginRight: 10,
                        textAlign: "center",
                      }}
                      {...register(`otp-${index}`, {
                        required: "OTP digit is required",
                      })}
                      onInput={(e) => {
                        // Move focus to the next input when the current input is filled
                        const nextIndex = index === 5 ? index : index + 1;
                        const nextInput = document.getElementById(
                          `otp-${nextIndex}`
                        );
                        if (e.target.value && nextInput) {
                          nextInput.focus();
                        }
                      }}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                </Box>
                <Box className="OTPMessage">
                  {errors.otp && <span>{errors.otp.message}</span>}
                </Box>
                <StyledButton
                  type="submit"
                  onClick={handleVerifyOTP}
                  variant="contained"
                  sx={{ ...buttonStyle }} // Use double curly braces and spread operator to pass the buttonStyle object
                >
                  Verify OTP
                </StyledButton>
                {/* </Box> */}

                <Stack direction={"column"} spacing={1}>
                  <Stack direction={"row"}>
                    <Typography
                      sx={{ marginTop: 3, marginRight: 2, color: "white" }}
                    >
                      Didn't Receive the Code?
                    </Typography>
                    <Typography
                      sx={{
                        textDecoration: "underline",
                        color: "blue",
                        cursor: "pointer",
                        marginTop: 3,
                      }}
                      onClick={handleResendOTP} // Add handleResendOTP function
                    >
                      Resend OTP
                    </Typography>
                  </Stack>
                  <Stack direction={"row"}>
                    <Box sx={{ marginRight: 2, color: "white" }}>
                      Email Sent Wrongly?
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
                      Back To Previous
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default OTPPage;
