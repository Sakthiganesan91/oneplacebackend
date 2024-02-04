const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  queryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "query",

    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  upVote: {
    count: { type: Number, default: 0 },
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
});

module.exports = mongoose.model("comment", commentSchema);
