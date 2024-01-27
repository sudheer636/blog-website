import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserName } from "../redux/action";

function ProfilePage(props) {
  const [email, setEmail] = useState();
  const [postCount, setPostCount] = useState();

  const username = useSelector((state) => state.username);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
    const storedUserName = localStorage.getItem("Username");
    if (storedUserName) {
      dispatch(setUserName(storedUserName));
    }
  }, [dispatch]);
  useEffect(() => {
    localStorage.setItem("Username", username);
  }, [username]);
  console.log('username---------', username);

  useEffect(() => {
    fetchData();
  })
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/userdetails/${username}`);
      const countResponse = await axios.get(`http://localhost:3001/post/myposts/${username}`);
      setPostCount(countResponse.data.length);
      setEmail(response.data.Email);
    } catch (err) {
      console.log("err- while fetching data from userdetails db", err);
    }
  };

  return (
    <div className="App">
      <h1> My email, {email} </h1>
      <h1> total no of posts: {postCount} </h1>

    </div>
  );
}

export default ProfilePage;
