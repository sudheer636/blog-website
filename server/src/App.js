const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
// const sharp = require("sharp");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const multer = require('multer');
const path = require('path');
const { schema, postSchema } = require("../../Schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
mongoose.connect(process.env.dbSecret, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("connected to mongodb");
});
console.log("Connected to db!");
app.listen(3001, () => console.log(`Server Up and running at 3001`));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/login", async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const existingUser = await schema.findOne({ Username });
    console.log("existing----", existingUser);
    if (existingUser) {
      const isCorrectPassword = await bcrypt.compare(
        Password,
        existingUser.Password
      );
      if (isCorrectPassword) {
        console.log("Username and Password are correct");
        return res.status(200).json({ UserId: existingUser.UserId });
      } else {
        console.log("Entered Password is InCorrect");
        return res
          .status(201)
          .json({ message: "Entered Password is InCorrect" });
      }
    } else {
      console.log("user doesn't exist");
      return res.status(202).json({ message: "Username doesnt exists" });
    }
  } catch (err) {
    console.log(err, "error");
    res.status(400).json({ message: "user unable to login" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { Username, Password, Email } = req.body;
    const existingUser = await schema.findOne({ Username });
    if (existingUser) {
      console.log("Username already exists");
      return res.status(200).json({ message: "Username already exists" });
    }
    const hashPassword = await bcrypt.hash(Password, 10);
    const userId = uuid().replace(/-/g, "");
    const newUser = new schema({
      Username,
      Password: hashPassword,
      Email,
      UserId: userId,
    });
    // console.log("---------pass", newUser);
    await newUser.save();
    console.log("user id and password saved in db", newUser);
    return res.status(200).json({ message: "sucessfully registred" });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

app.get("/userdetails/:username", async (req, res) => {
  const username = req.params.username;
  const existingUser = await schema.findOne({ Username: username });
  if (existingUser) {
    // console.log("Username is available", existingUser);
    return res
      .status(200)
      .json({ Username: existingUser.Username, Email: existingUser.Email });
  }
  console.log("username not available in db");
  return res.status(200).json({ message: "username not available" });
});

app.get("/post/search/:query", async (req, res) => {
  const query = req.params.query;
  const postDetails = await postSchema
    .find({
      PostMessage: { $regex: new RegExp(query, "i") },
    })
    .sort({ CreatedDateTime: -1 });
  if (postDetails) {
    return res.status(200).json(postDetails);
  }
  console.log("posts are not available in db");
  return res.status(200).json({ message: "posts are not available in db" });
});

app.post("/post/savepost", upload.single('image'), async (req, res) => {
  try {
    //  upload.single("image")
    const PostId = uuid().replace(/-/g, "");
    // const Username = "1234";
    const CreatedDateTime = new Date();
    const { PostMessage, Username, ImageUrl } = req.body;
    // console.log("----req.body---", req.body);
    // const resSizedImage = await sharp(req.file.buffer)
    //   .resize({ width: 10, height: 10 })
    //   .toBuffer();
    const newPost = new postSchema({
      PostId,
      Username,
      PostMessage,
      CreatedDateTime,
      ImageUrl,
      // Image: {
      //   data: req.file.buffer,
      //   contentType: req.file.mimetype,
      // },
    });
    // console.log('--------', newPost);
    // console.log("----buffer----", req.file.buffer);
    // console.log("--mimetype---", req.file.mimetype);
    await newPost.save();
    return res.status(200).json({ message: "new post added" });
  } catch (err) {
    console.log("error while posting new post in backend-----", err);
    return res.status(400).json({ message: "unable to add new post added" });
  }
});

app.get("/post/getposts", async (req, res) => {
  try {
    const postedMsgs = await postSchema.find().sort({ CreatedDateTime: -1 });
    res.status(200).json(postedMsgs);
  } catch (err) {
    console.log("err-in getting posts from mongodb", err);
    res.status(400).json({ message: "err-in getting posts from mongodb" });
  }
});

app.get("/post/myposts/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const postedMsgs = await postSchema
      .find({ Username: username })
      .sort({ CreatedDateTime: -1 });
    res.status(200).json(postedMsgs);
  } catch (err) {
    console.log("err-in getting posts from mongodb", err);
    res.status(400).json({ message: "err-in getting posts from mongodb" });
  }
});

app.put("/post/update/:postid", async (req, res) => {
  try {
    const updatedPostMessage = req.body.PostMessage;
    const PostId = req.params.postid;
    console.log("entered into update------------->", PostId);
    const isPostAvailable = await postSchema.findOne({
      _id: req.params.postid,
    });
    if (isPostAvailable) {
      const updatedPost = await postSchema.findByIdAndUpdate(
        PostId,
        {
          $set: { PostMessage: updatedPostMessage },
        },
        { new: true }
      );
      return res.status(200).json(updatedPost);
    }
    console.log("there is no post with the give postId");
    return res
      .status(200)
      .json({ message: "there is no post with the give postId" });
  } catch (err) {
    console.log("error while updating the post", err);
    res.status(400).json({ message: "err-in updating posts from mongodb" });
  }
});

app.delete("/post/delete/:postid", async (req, res) => {
  try {
    const PostId = req.params.postid;
    const isPostAvailable = await postSchema.findOne({ _id: PostId });
    if (isPostAvailable) {
      const post = await postSchema.findById(PostId);
      await post.deleteOne();
      return res.status(200).json(post);
    }
    console.log("there is no post with the give postId");
    return res
      .status(201)
      .json({ message: "There is no post with the give postId" });
  } catch (err) {
    console.log("error while deleting the post", err);
    res.status(400).json({ message: "err-in deleting posts from mongodb" });
  }
});
