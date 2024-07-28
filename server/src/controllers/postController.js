const { v4: uuid } = require("uuid");
const { postSchema } = require("../Schema");
const verifyToken = require("../auth-token");

exports.searchPosts = [
  verifyToken,
  async (req, res) => {
    const query = req.body.searchInput;
    const timePeriod = req.body.timePeriod;
    let searchQuery = {};
    if (timePeriod) {
      searchQuery.CreatedDateTime = { $gte: new Date(timePeriod) };
    }
    if (!req.body.homepage) {
      const username = req.username;
      searchQuery.$and = [
        { PostMessage: { $regex: new RegExp(query, "i") } },
        { Username: username },
      ];
    } else {
      searchQuery.PostMessage = { $regex: new RegExp(query, "i") };
    }

    const postDetails = await postSchema
      .find(searchQuery)
      .sort({ CreatedDateTime: -1 });
    if (postDetails) {
      return res.status(200).json(postDetails);
    }
    console.log("posts are not available in db");
    return res.status(200).json({ message: "posts are not available in db" });
  },
];

exports.savePost = [
  verifyToken,
  async (req, res) => {
    try {
      const PostId = uuid().replace(/-/g, "");
      const CreatedDateTime = new Date();
      const { PostMessage } = req.body;
      const Username = req.username;
      const newPost = new postSchema({
        PostId,
        Username,
        PostMessage,
        CreatedDateTime,
      });
      await newPost.save();
      return res.status(200).json({ message: "new post added" });
    } catch (err) {
      console.log("error while posting new post in backend-----", err);
      return res.status(400).json({ message: "unable to add new post added" });
    }
  },
];

exports.getPosts = [
  verifyToken,
  async (req, res) => {
    try {
      const postedMsgs = await postSchema.find().sort({ CreatedDateTime: -1 });
      res.status(200).json(postedMsgs);
    } catch (err) {
      console.log("err-in getting posts from mongodb", err);
      res.status(400).json({ message: "err-in getting posts from mongodb" });
    }
  },
];

exports.getMyPosts = [
  verifyToken,
  async (req, res) => {
    try {
      const username = req.username;
      const postedMsgs = await postSchema
        .find({ Username: username })
        .sort({ CreatedDateTime: -1 });
      res.status(200).json(postedMsgs);
    } catch (err) {
      console.log("err-in getting posts from mongodb", err);
      res.status(400).json({ message: "err-in getting posts from mongodb" });
    }
  },
];

exports.updatePost = [
  verifyToken,
  async (req, res) => {
    try {
      const updatedPostMessage = req.body.PostMessage;
      const PostId = req.params.postid;
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
  },
];

exports.deletePost = [
  verifyToken,
  async (req, res) => {
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
  },
];
