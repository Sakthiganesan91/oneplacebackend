const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  try {
    const user = await User.signin(email, password);
    const token = createToken(user._id);
    res.status(200).json({ id: user._id, token, user });
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ error: err.message });
  }
};

const signup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const bio = req.body.bio;
  const github = req.body.github;

  const linkedin = req.body.linkedin;
  const username = req.body.username;
  const phoneNumber = req.body.phoneNumber;
  const rooms = req.body.rooms;

  try {
    const user = await User.signup(
      username,
      phoneNumber,
      firstName,
      lastName,
      email,
      password,
      github,
      linkedin,
      bio,
      email,
      password,
      rooms
    );
    const token = createToken(user._id);
    res.status(200).json({ id: user._id, token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const findUserByEmail = async (req, res) => {
  const email = req.body.email;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw Error("User Already Exists");
    }

    res.status(200).json({
      message: "Valid Email",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    const token = req.body.token;
    const { _id } = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id }).select("_id");

    // if (!user) {
    //   throw false;
    // }

    res.status(201).json({
      tokenValid: true,
    });
  } catch (error) {
    res.status(403).json({
      tokenValid: false,
    });
  }
};

module.exports = {
  login,
  signup,
  findUserByEmail,
  verifyToken,
};
