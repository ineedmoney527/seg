import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
// import background from "./UoSM Background.jpg";

const LoginPage = () => {
  const [username, setUsername] = useState("sc121@soton.ac.uk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signIn = useSignIn();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", { username, password });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { username, password }
      );
      console.log("ss" + response);

      if (response.data.success) {
        const token = response.data.token;

        signIn({
          token: token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: { email: username },
        });

        navigate("/admin");
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
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          </div>
          <button type="submit" className="Login_button">
            Login
          </button>
          {error && <p className="Login_error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;