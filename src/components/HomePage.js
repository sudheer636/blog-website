import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import multer from "multer";
import PostModal from "./PostModal";
import { setUserName } from "../redux/action";
import "./HomePage.css";

function HomePage(props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [post, setPost] = useState([]);
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
  console.log("username---------", username);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/post/getposts");
      console.log('--pozts---', response.data);
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

  const isModalOpen = async () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
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
              {/* <div className="image-div">
              <img src ={`data:${item.Image.contentType};base64,${item.Image.data.toString('base64')}`} alt="postImage"></img>
              </div> */}
              <div>Posted by {item.Username} </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// const Username = useSelector((state)=> state.username);
// setUserName(Username);
// console.log('username-------', username);

// import React from "react";
// import axios from "axios";
// import Modal from "react-modal";
// import PostModal from "./PostModal";
// import "./HomePage.css";

// class HomePage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       modalOpen: false,
//       post: [],
//       newPost: "",
//       postDialog: false,
//       postId: "",
//       username: '',
//     };
//   }

//   componentDidMount() {
//     this.fetchData();
//   }
//   fetchData = async () => {
//     try {
//       const username = this.state.username;
//       const response = await axios.get("http://localhost:3001/post/getposts");
//       this.setState({ post: response.data });
//       this.setState({username: username})
//     } catch (err) {
//       console.log("err- while fetching data from db", err);
//     }
//   };

//   async onClickDelete(id) {
//     try {
//       await axios.delete(`http://localhost:3001/post/delete/${id}`);
//       this.fetchData();
//     } catch (err) {
//       console.log("err- while fetching data from db", err);
//     }
//   }

//   async onClickEdit(id) {
//     try {
//       await axios.put(`http://localhost:3001/post/update/${id}`, {
//         PostMessage: this.state.newPost,
//       });
//       this.setState({ postDialog: false });
//       this.fetchData();
//     } catch (err) {
//       console.log("err- while fetching data from db", err);
//     }
//   }

//   onCloseDialog = async () => {
//     this.setState({ postDialog: false });
//   };

//   editMessage = async (event) => {
//     this.setState({ newPost: event.target.value });
//   };

//   isModalOpen = async () => {
//     this.setState({ modalOpen: true });
//   };
//   closeModal = () => {
//     this.setState({ modalOpen: false });
//   };
//   render() {
//     const { post, postDialog, postId } = this.state;
//     let user = this.state.username;
//     return (
//       <div className="App">
//         <div>
//           <h1> Home </h1>
//           <form>
//             <label>Add post: </label>
//             <p> {user} </p>
//           </form>
//           <button onClick={this.isModalOpen}>Add</button>
//           {this.state.modalOpen && <PostModal closeModal={this.closeModal} />}
//         </div>
//         <div className="post-div">
//           {post.map((item, index) => (
//             <div key={index}>
//               <div>
//                 <div>{item.PostMessage}</div>
//                 <button
//                   onClick={() =>
//                     this.setState({
//                       postDialog: true,
//                       newPost: item.PostMessage,
//                       postId: item._id,
//                     })
//                   }
//                 >
//                   Edit Post
//                 </button>
//                 <Modal isOpen={postDialog} onRequestClose={this.onCloseDialog}>
//                   <p>Hello this is model</p>
//                   <input
//                     value={this.state.newPost}
//                     onChange={this.editMessage}
//                   ></input>
//                   <button onClick={() => this.onClickEdit(postId)}>Save</button>
//                   <button onClick={() => this.onCloseDialog()}> close </button>
//                 </Modal>
//                 <button
//                   onClick={() => this.onClickDelete(item._id)}
//                   className="post-del-btn"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
// }

export default HomePage;
