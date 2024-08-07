import React, { useState, useEffect } from "react";
import axios from "axios";
import { history } from "../App";
import "./Profile.css";


function ProfilePage() {
  const [email, setEmail] = useState();
  const [postCount, setPostCount] = useState();
  const [username, setUsername] = useState();
  const baseUrl = process.env.REACT_APP_HostUrl;

  // const token = localStorage.getItem("token");
  const token = getCookie("token");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    fetchData();
  });

  const fetchData = async (retry = 2) => {
    try {
      if (!token) {
        history.push("/timeout");
        return;
      }
      const response = await axios.get(
        `${baseUrl}/auth/userdetails`,
        {
          withCredentials: true
        }
      );
      const countResponse = await axios.get(
        `${baseUrl}/post/myposts`,
        {
          withCredentials: true
        }
      );
      setPostCount(countResponse.data.length);
      setEmail(response.data.Email);
      setUsername(response.data.Username);
    } catch (err) {
      console.log("err- while fetching data from userdetails db", err);
      if (err.response && err.response.status > 400 && retry > 0) {
        await refreshToken();
        fetchData(retry -1);
      } else {
        history.push("/timeout");
      }
    }
  };
  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/refresh-token`,
        {
          token,
        }
      );
      const { newToken } = response.data;
      document.cookie = `token=${newToken}; path=/;`;
    } catch (err) {
      console.error("Error refreshing token:", err);
    }
  };

  const logout = async () => {
    history.push("/auth/login");
    return;
  }

  return (
    <div className="profile-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h1>Username: {username}</h1>
        <h1>My email: {email}</h1>
        <h1>Total no of posts: {postCount}</h1>
      </div>
      <button className="logout-btn" onClick={logout}>Log out</button>
    </div>
  );
}

export default ProfilePage;
