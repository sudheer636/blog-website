import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from 'react-router-dom';
import { history } from "../App";

function RegisterPage(props) {
  const [inputUsername, setuserInputUsername] = useState("");
  const [inputPassword, setuserInputPassword] = useState("");
  const [inputEmail, setuserInputEmail] = useState("");
  // const navigate = useNavigate();

  const handleClickUsername = async (event) => {
    setuserInputUsername(event.target.value);
  };
  const handleClickPassword = async (event) => {
    setuserInputPassword(event.target.value);
  };
  const handleClickEmail = async (event) => {
    setuserInputEmail(event.target.value);
  };

  const handleclick = async () => {
    console.log("username-----", inputUsername, inputPassword, inputEmail);
    try {
      const data = {
        Username: inputUsername,
        Password: inputPassword,
        Email: inputEmail,
      };
      console.log("data-----", data);
      const response = await axios.post("http://localhost:3001/register", data);
      console.log("resp---------", response);
      if (response.status === 200) {
        console.log("registered succesfully");
        history.push('/login');
      } else {
        console.log("user id and password doesn't exists");
      }
    } catch (err) {
      console.log("error----", err);
    }
  };
  return (
    <div className="App">
      <h1> Sign Up </h1>
      <form>
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
        <button type="submit" onClick={handleclick}>
          Register
        </button>
      </form>

      <br></br>
      {/* <button onClick={() => props.onSwitch("login")}> */}
      <button>Already having account.? Login</button>
    </div>
  );
}

export default RegisterPage;
