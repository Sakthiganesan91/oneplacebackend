const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  username: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
    required: true,
  },

  github: {
    type: String,
  },
  linkedin: {
    type: String,
  },

  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "query",
    },
  ],

  rooms: [
    {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.statics.signup = async function (
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
) {
  try {
    const existingUser = await this.findOne({ email });

    if (existingUser) {
      throw Error("User Already Exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({
      username,
      phoneNumber,
      email,
      password: hashedPassword,
      rooms,
      firstName,
      lastName,
      github,
      linkedin,
      bio,
    });
    return user;
  } catch (error) {
    throw Error(error);
  }
};
userSchema.statics.signin = async function (email, password) {
  const existingUser = await this.findOne({
    email,
  });

  if (!existingUser) {
    throw Error("User does not exist");
  }

  const match = await bcrypt.compare(password, existingUser.password);

  if (match) {
    return existingUser;
  } else {
    throw Error("Check Password and Try Again");
  }
};

module.exports = mongoose.model("user", userSchema);
