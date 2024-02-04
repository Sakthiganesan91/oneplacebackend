const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const querySchema = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  detailsWanted: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  useful: {
    usefulCount: { type: Number, default: 0 },
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
});

module.exports = mongoose.model("query", querySchema);

// file: [
//   {
//     mime: {
//       type: String,
//     },
//     data: {
//       type: String,
//     },
//   },
// ],

// file: {
//   type: Schema.Types.Mixed,
// },
