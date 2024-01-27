import React, { useState } from "react";
import axios from "axios";
import { v4 } from "uuid";
import { storage } from "../firebase-config"; // Adjust the path accordingly
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "./PostModal.css";

const PostModal = ({ closeModal, username }) => {
  const [userMessage, setUserMessage] = useState("");
  const [image, setImage] = useState(null);

  const handlePostClick = (event) => {
    setUserMessage(event.target.value);
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  console.log("--frksjnv==", username);

  const savePost = async () => {
    try {
      // const imagesListRef = ref(storage, "images/");
      const imageRef = ref(storage, `images/${image.name + v4()}`);
      await uploadBytes(imageRef, image);

      const imageUrl = await getDownloadURL(imageRef);
      // await imageRef.put(image);
      // const imageUrl = await imageRef.getDownloadURL();
      const data = {
        PostMessage: userMessage,
        Username: username,
        ImageUrl: imageUrl,
      };
      const response = await axios.post(
        "http://localhost:3001/post/savepost",
        data
      );
      if (response.status === 200) {
        console.log("Post saved successfully!");
      } else {
        console.error("Failed to save post:", response.data.message);
      }
      console.log("response---", response);
    } catch (err) {
      console.log("Error while posting new post:", err);
    }
  };

  return (
    <div>
      <div className="modal-wrapper" onClick={closeModal}></div>
      <div className="modal-container">
        <form>
          <h1>Create a New Post</h1>
          <label>Post Message:</label>
          <input
            id="postMessage"
            type="text"
            value={userMessage}
            onChange={handlePostClick}
          ></input>
          <label>Choose Image:</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFileChange}
          ></input>
          <br />
          <button className="post-btn" onClick={savePost}>
            Post
          </button>
          <button className="close-btn" onClick={closeModal}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
