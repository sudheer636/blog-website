const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/post/search", postController.searchPosts);
router.post("/post/savepost", postController.savePost);
router.get("/post/getposts", postController.getPosts);
router.get("/post/myposts", postController.getMyPosts);
router.put("/post/update/:postid", postController.updatePost);
router.delete("/post/delete/:postid", postController.deletePost);

module.exports = router;
