const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
    unique: true,
  },
});

const PostSchema = new mongoose.Schema({
  PostId: {
    type: String,
    required: true,
    unique: true,
  },
  Username: {
    type: String,
    required: true,
  },
  PostMessage: {
    type: String,
    required: true,
  },
  CreatedDateTime: {
    type: Date,
  },
  ImageUrl: {
    type:String,
  }
});

module.exports = {
  schema: mongoose.model("loginSchema", LoginSchema),
  postSchema: mongoose.model("postSchema", PostSchema),
};
