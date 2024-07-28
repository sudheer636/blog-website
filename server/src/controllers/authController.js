const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { schema } = require("../Schema");
const verifyToken = require("../auth-token");

exports.login = async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const existingUser = await schema.findOne({ Username });
    if (existingUser) {
      const isCorrectPassword = await bcrypt.compare(
        Password,
        existingUser.Password
      );
      if (isCorrectPassword) {
        const token = jwt.sign(
          { username: existingUser.Username },
          process.env.JWT_SECRET,
          { expiresIn: '30m' }
        );
        console.log("Username and Password are correct");
        return res.status(200).json({ token });
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
};

exports.register = async (req, res) => {
  try {
    const { Username, UserPassword, Email } = req.body;
    const existingUser = await schema.findOne({ Username });
    if (existingUser) {
      console.log("Username already exists");
      return res.status(200).json({ message: "Username already exists" });
    }
    const Password = await bcrypt.hash(UserPassword, 10);
    const UserId = uuid().replace(/-/g, "");
    const newUser = new schema({
      Username,
      Password,
      Email,
      UserId,
    });
    const savedUser = await newUser.save();
    console.log("User ID and password saved in db", savedUser);
    return res.status(200).json({ message: "Successfully registered" });
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(400).json({ message: err.message });
  }
};

exports.getUserDetails = [
  verifyToken,
  async (req, res) => {
    try {
      const username = req.username;
      const existingUser = await schema.findOne({ Username: username });

      if (existingUser) {
        return res.status(200).json({
          Username: existingUser.Username,
          Email: existingUser.Email
        });
      }

      console.log("Username not available in db");
      return res.status(200).json({ message: "Username not available" });
    } catch (error) {
      console.error("Error in getUserDetails:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
];

exports.generateToken = async (req, res) => {
  try {
    const { Username } = req.body;
    const existingUser = await schema.findOne({ Username });
    if (existingUser) {
      const token = jwt.sign(
        { username: existingUser.Username },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );
      console.log("Username and Password are correct");
      return res.status(200).json({ token });
    } else {
      console.log("user doesn't exist");
      return res.status(202).json({ message: "Username doesnt exists" });
    }
  } catch (err) {
    console.log(err, "error");
    res.status(400).json({ message: "user unable to login" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const existingUser = await schema.findOne({ Username: decoded.username });

    if (existingUser) {
      const newToken = jwt.sign(
        { username: existingUser.Username },
        process.env.JWT_SECRET,
        { expiresIn: '5m' } 
      );
      return res.status(200).json({ newToken });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error refreshing token:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};