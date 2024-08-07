import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { history } from "../App";
import './loginPage.css';
import { setUserName, setToken } from "../redux/action";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const baseUrl = process.env.REACT_APP_HostUrl;

  useEffect(() => {
    localStorage.setItem("token", null);
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }, []);

  const handleInputChange = (event, setState) => {
    setState(event.target.value);
  };

  const redirectToRegisterPage = () => {
    history.push("/auth/register");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const data = {
        Username: username,
        Password: password,
      };

      const response = await axios.post(`${baseUrl}/auth/login`, data);

      if (response.status === 200) {
        const { data: responseData } = response;
        const token = responseData.token;
        dispatch(setUserName(username));
        dispatch(setToken(token));
        localStorage.setItem("Username", username);
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; Secure; SameSite=None;`;
        history.push("/home");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => handleInputChange(e, setUsername)}
          required
        />
        <br />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => handleInputChange(e, setPassword)}
          required
        />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
      <br />
      <button onClick={redirectToRegisterPage}>Don't have an account? Sign Up</button>
    </div>
  );
}

export default LoginPage;
