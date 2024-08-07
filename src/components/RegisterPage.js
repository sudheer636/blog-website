import React, { useState, useEffect } from "react";
import axios from "axios";
import { history } from "../App";
import "./RegisterPage.css";

function RegisterPage(props) {
  const [inputUsername, setuserInputUsername] = useState("");
  const [inputPassword, setuserInputPassword] = useState("");
  const [inputEmail, setuserInputEmail] = useState("");
  const baseUrl = process.env.REACT_APP_HostUrl;


  useEffect(() => {
    localStorage.setItem("token", null);
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }, []);

  const handleClickUsername = async (event) => {
    setuserInputUsername(event.target.value);
  };
  const handleClickPassword = async (event) => {
    setuserInputPassword(event.target.value);
  };
  const handleClickEmail = async (event) => {
    setuserInputEmail(event.target.value);
  };

  const redirectToLoginPage = () => {
    history.push("/auth/login");
  };

  const handleclick = async (event) => {
    event.preventDefault();
  
    try {
      const data = {
        Username: inputUsername,
        UserPassword: inputPassword,
        Email: inputEmail,
      };
      const response = await axios.post(
        `${baseUrl}/auth/register`,
        data
      );
      if (response.status === 200) {
        alert("Registration successful!");
        history.push("/auth/login");
      } else {
        console.log("user id and password doesn't exists");
      }
    } catch (err) {
      console.log("error----", err);
    }
  };
  return (
    <div className="register-container">
      <h1> Sign Up </h1>
      <form onSubmit={handleclick}>
        <label>Username:</label>
        <input
          id="userinput"
          type="text"
          value={inputUsername}
          onChange={handleClickUsername}
          required
        ></input>
        <br></br>
        <br></br>
        <label>Password:</label>
        <input
          id="userinputPassword"
          type="password"
          value={inputPassword}
          onChange={handleClickPassword}
          required
        ></input>
        <br></br>
        <br></br>
        <label>email:</label>
        <input
          id="userinputemail"
          type="text"
          value={inputEmail}
          onChange={handleClickEmail}
          required
        ></input>
        <br></br>
        <br></br>
        <button type="submit">
          Register
        </button>
      </form>

      <br></br>
      <button onClick={redirectToLoginPage}>
        Already having account.? Login
      </button>
    </div>
  );
}

export default RegisterPage;
