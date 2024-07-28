import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import PostModal from "./PostModal";
import { history } from "../App";
import "./MyPosts.css";

function MyPosts() {
  const [modalOpen, setModalOpen] = useState(false);
  const [postData, setPostData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("No filter");
  const [selectedCategoryTime, setSelectedCategoryTime] = useState(null);
  const baseUrl = process.env.REACT_APP_HostUrl;

  const token = getCookie("token");
  const categories = [
    "No filter",
    "Past 10min",
    "Past 30min",
    "Past 1 hour",
    "Past 2 hours",
    "Past 6 hours",
    "Past 1 day",
    "Past 1 week",
    "Past 1 month",
    "Past 1 year",
  ];

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  let username = localStorage.getItem("Username");
  username = username === "null" ? null : username;

  useEffect(() => {
    fetchData();
  }, [username]);

  const fetchData = async (retry = 2) => {
    try {
      const response = await axios.get(`${baseUrl}/post/myposts`, {
        withCredentials: true,
      });
      setPostData(response.data);
    } catch (err) {
      if (err.response && err.response.status > 400 && retry > 0) {
        console.log("-----err.response----", err.response);
        await refreshToken();
        fetchData(retry - 1);
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

  const getTimePeriod = (category) => {
    const now = new Date();
    switch (category) {
      case "Past 10min":
        return new Date(now.getTime() - 10 * 60 * 1000).toISOString();
      case "Past 30min":
        return new Date(now.getTime() - 30 * 60 * 1000).toISOString();
      case "Past 1 hour":
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case "Past 2 hours":
        return new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      case "Past 6 hours":
        return new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
      case "Past 1 day":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case "Past 1 week":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case "Past 1 month":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case "Past 1 year":
        return new Date(
          now.getTime() - 365 * 24 * 60 * 60 * 1000
        ).toISOString();
      default:
        return null;
    }
  };

  const searchPosts = async () => {
    try {
      const searchInput = document.getElementById("searchInput").value;
      if (searchInput.length > 0 || selectedCategoryTime) {
        const response = await axios.post(
          `${baseUrl}/post/search`,
          { timePeriod: selectedCategoryTime, searchInput, homepage: false },
          { withCredentials: true }
        );
        setPostData(response.data.length > 0 ? response.data : []);
      } else {
        fetchData();
      }
    } catch (err) {
      console.error("Error searching data from db", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/post/delete/${id}`, {
        withCredentials: true,
      });
      fetchData();
    } catch (err) {
      console.log("Error deleting data from db", err);
    }
  };

  const handleEditPost = (item, event) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedPost(item);
    setModalOpen(true);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedCategoryTime(getTimePeriod(event.target.value));
  };

  return (
    <div className="mypage-container">
      <div className="search-input">
        <input type="text" placeholder="Search" id="searchInput" />
        <select
          className="filter-dropdown"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button onClick={searchPosts}>Search</button>
      </div>
      <div className="add-post-container">
        <label type="text" placeholder="Add post" id="postInput" />
        <button onClick={() => setModalOpen(true)}>Add Post</button>
      </div>
      {modalOpen && (
        <PostModal
          closeModal={() => setModalOpen(false)}
          username={username}
          editMode={Boolean(selectedPost)}
          postDetails={selectedPost}
        />
      )}
      <div className="post-div">
        {postData.length > 0 ? (
          postData.map((item, index) => (
            <div key={index} className="individual-post-div">
              <div className="msg-div">{item.PostMessage}</div>
              <div className="post-actions">
                <button onClick={(e) => handleEditPost(item, e)}>Edit Post</button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="post-del-btn"
                >
                  Delete
                </button>
                <span className="created-date">
                  {" "}
                  Posted{" "}
                  {formatDistanceToNow(new Date(item.CreatedDateTime), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">No Posts available</div>
        )}
      </div>
    </div>
  );
}

export default MyPosts;
