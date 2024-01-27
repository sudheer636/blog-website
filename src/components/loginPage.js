import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import axios from "axios";
import { history } from "../App";
import { setUserName } from "../redux/action";

// import { createBrowserHistory } from "history";
// import fetch from 'node-fetch'
// const fetch = require('node-fetch');

function LoginPage() {
  const [userInputUsername, setuserInputUsername] = useState("");
  const [userInputPassword, setuserInputPassword] = useState("");
  const dispatch = useDispatch();
  // const history = createBrowserHistory();

  const handleclickUsername = async (event) => {
    setuserInputUsername(event.target.value);
  };
  const handleclickPassword = async (event) => {
    setuserInputPassword(event.target.value);
  };
  const handleclick = async (e) => {
    e.preventDefault();
    try {
      const data = {
        Username: userInputUsername,
        Password: userInputPassword,
      };
      console.log('data----', data);
      const response = await axios.post("http://localhost:3001/login", data);
      console.log("response------", response);
      if (response.status === 200) {
        // setIsAuthenticated(true);
        dispatch(setUserName(userInputUsername));
        history.push('/home');
        console.log("succesfull login");
      } else {
        alert('invalid credentials')
      }
    } catch (err) {
      console.log("error----", err);
    }
  };

  return (
    <div className="App">
      <h1> Login </h1>
      <form>
        <label>Username:</label>
        <input
          id="userinput"
          type="text"
          value={userInputUsername}
          onChange={handleclickUsername}
          required
        ></input>
        <br></br>
        <br></br>
        <label>Password:</label>
        <input
          id="userinputPassword"
          type="password"
          value={userInputPassword}
          onChange={handleclickPassword}
          required
        ></input>
        <br></br>
        <br></br>
        <button onClick={(e) => handleclick(e)} type="submit">
          Login
        </button>
      </form>
      <br></br>
      {/* <button onClick={() => props.onSwitch("register")}> */}
      <button>Don't have account.? Sign Up</button>
    </div>
  );
}

export default LoginPage;
