import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName } from '../redux/action';
import PostModal from './PostModal';
import { history } from '../App';
import './HomePage.css';

function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('No filter');
  const [selectedCategoryTime, setSelectedCategoryTime] = useState(null);
  const baseUrl = process.env.REACT_APP_HostUrl;

  const [posts, setPosts] = useState([]);
  const username = useSelector((state) => state.username);
  const dispatch = useDispatch();
  const token = getCookie('token');
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
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const fetchData = async (retry = 1) => {
    try {
      const storedUserName = localStorage.getItem('Username');
      if (storedUserName) {
        dispatch(setUserName(storedUserName));
      }

      const response = await axios.get(`${baseUrl}/post/getposts`, {
        withCredentials: true,
      });
      setPosts(response.data);
    } catch (err) {
      if (err.response && err.response.status >= 401 && retry > 0) {
        await refreshToken();
        fetchData(retry - 1);
      } else {
        history.push('/timeout');
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
      document.cookie = `token=${newToken}; path=/; Secure; SameSite=None;`;
    } catch (err) {
      console.error('Error refreshing token:', err);
    }
  };

  const getTimePeriod = (category) => {
    const now = new Date();
    switch (category) {
      case 'Past 10min':
        return new Date(now.getTime() - 10 * 60 * 1000).toISOString();
      case 'Past 30min':
        return new Date(now.getTime() - 30 * 60 * 1000).toISOString();
      case 'Past 1 hour':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case 'Past 2 hours':
        return new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      case 'Past 6 hours':
        return new Date(now.getTime() - 6 * 60 * 1000).toISOString();
      case 'Past 1 day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case 'Past 1 week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'Past 1 month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case 'Past 1 year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchPosts = async () => {
    try {
      const searchInput = document.getElementById('searchInput').value;
      if (searchInput.length > 0 || selectedCategoryTime) {
        const response = await axios.post(
          `${baseUrl}/post/search`,
          { timePeriod: selectedCategoryTime, searchInput, homepage: true },
          { withCredentials: true }
        );
        setPosts(response.data.length > 0 ? response.data : []);
      } else {
        fetchData();
      }
    } catch (err) {
      console.error('Error searching data from db', err);
    }
  };

  const openModal = () => {
    setModalOpen(true);
    setSelectedPost(null);
  };

  const clickPost = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedCategoryTime(getTimePeriod(event.target.value));
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="homepage-container">
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
        <button onClick={openModal}>Add Post</button>
        {modalOpen && !selectedPost && (
          <PostModal closeModal={closeModal} username={username} />
        )}
      </div>
      <div className="post-div">
        {posts.length > 0 ? (
          posts.map((item, index) => (
            <div key={index} onClick={() => clickPost(item)}>
              <div className="individual-post-div">
                <div className="individual-post-username">
                  <div className="user-image-placeholder"></div>
                  <span>{item.Username}</span>
                  <span className="created-date">
                    {' '}
                    Posted{' '}
                    {formatDistanceToNow(new Date(item.CreatedDateTime), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="msg-div">{item.PostMessage}</div>
              </div>
              {selectedPost && modalOpen && selectedPost._id === item._id && (
                <PostModal
                  closeModal={closeModal}
                  username={username}
                  editMode={false}
                  viewMode={true}
                  postDetails={selectedPost}
                />
              )}
            </div>
          ))
        ) : (
          <div className="no-posts">No Posts available</div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
