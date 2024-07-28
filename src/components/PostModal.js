import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./PostModal.css";

const PostModal = ({
  closeModal,
  username,
  editMode,
  postDetails,
  viewMode,
}) => {
  const [userMessage, setUserMessage] = useState("");
  const [userPost, setUserPost] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const modalRef = useRef(null);
  const baseUrl = process.env.REACT_APP_HostUrl;

  useEffect(() => {
    setUserPost(postDetails);
    setUserMessage(postDetails ? postDetails.PostMessage : "");
  }, [postDetails]);

  useEffect(() => {
    setIsCurrentUser(username === (postDetails && postDetails.Username));
  }, [username, postDetails]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  const handlePostMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const saveOrUpdatePost = async (event) => {
    event.preventDefault();
    const data = {
      PostMessage: userMessage,
      Username: username,
    };
    try {
      if (viewMode || editMode) {
        await axios.put(`${baseUrl}/post/update/${userPost._id}`, data, { withCredentials: true });
        console.log("Post updated successfully!");
      } else {
        await axios.post(`${baseUrl}/post/savepost`, data, { withCredentials: true });
        console.log("Post saved successfully!");
      }
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error saving or updating post:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <form onSubmit={saveOrUpdatePost}>
          <h1 className="posted-by">
            {editMode ? "Edit Post" : "Create a New Post"}
          </h1>
          <div className="post-message">
            <label>Post Message:</label>
            <br />
            <textarea
              id="postMessage"
              type="text"
              value={userMessage}
              className="large-input"
              onChange={handlePostMessageChange}
              readOnly={viewMode && !isCurrentUser}
            />
            {!viewMode || isCurrentUser ? (
              <button className="post-btn" type="submit">
                {editMode ? "Update" : "Post"}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
