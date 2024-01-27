import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import PostModal from "./PostModal";
import { setUserName } from "../redux/action";
import "./HomePage.css";

function MyPosts(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [post, setPost] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [postDialog, setPostDialog] = useState(false);
  const [postId, setPostId] = useState("");
  // const [username, setUserName] = useState("");

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


  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/post/myposts/${username}`);
      setPost(response.data);
    } catch (err) {
      console.log("err- while fetching data from db", err);
    }
  };

  const searchPosts = async () => {
    try {
      const searchInput = document.getElementById("searchInput").value;
      if (searchInput.length > 0) {
        const response = await axios.get(
          `http://localhost:3001/post/search/${searchInput}`
        );
        if (response.data.length > 0) {
          setPost(response.data);
        } else {
          fetchData();
        }
      } else {
        fetchData();
      }
    } catch (err) {
      console.log("err- while searching data from db", err);
    }
  };
  const onClickDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/post/delete/${id}`);
      fetchData();
    } catch (err) {
      console.log("err- while deleting data from db", err);
    }
  };

  const onClickEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3001/post/update/${id}`, {
        PostMessage: newPost,
      });
      setPostDialog(false);
      fetchData();
    } catch (err) {
      console.log("err- while updation data from db", err);
    }
  };

  const onCloseDialog = async () => {
    setPostDialog(false);
  };

  const editMessage = async (event) => {
    setNewPost(event.target.value);
  };

  const isModalOpen = async () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const editPost = (item) => {
    setNewPost(item.PostMessage);
    setPostDialog(true);
    setPostId(item._id);
  };

  return (
    <div className="App">
      <div>
      <input
          input="text"
          placeholder="Search"
          id="searchInput"
        ></input>
        <button onClick={() => searchPosts()}>Search</button>
        <form>
          <label>Add post: </label>
        </form>
        <button onClick={isModalOpen}>Add Post</button>
        {modalOpen && <PostModal closeModal={closeModal} username={username} />}
      </div>
      <div className="post-div">
        {post.map((item, index) => (
          <div key={index}>
            <div className="individual-post-div">
              <div className="msg-div">{item.PostMessage}</div>
              <button
                onClick={() => {
                  editPost(item);
                }}
              >
                Edit Post
              </button>
              <Modal isOpen={postDialog} onRequestClose={onCloseDialog}>
                <p>Hello this is model</p>
                <input value={newPost} onChange={editMessage}></input>
                <button onClick={() => onClickEdit(postId)}>Save</button>
                <button onClick={() => onCloseDialog()}> close </button>
              </Modal>
              <button
                onClick={() => onClickDelete(item._id)}
                className="post-del-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MyPosts;
