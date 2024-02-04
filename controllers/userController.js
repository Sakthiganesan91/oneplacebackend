const User = require("../models/userModel");
const findUserById = async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findOne({ _id });

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(402).json({
      error,
    });
  }
};

const joinRoom = async (req, res) => {
  const _id = req.params.id;

  try {
    const room = req.body.room;
    const user = await User.findOne({ _id }, { rooms: true });

    const isRoompresent = user.rooms.find((r) => {
      return r.id === room;
    });

    if (isRoompresent) {
      throw "Already Joined";
    }

    await user.rooms.push({
      category: room,
      name: room,
      id: room,
    });

    user.save();

    res.status(201).json({
      message: "Joined Room Successfully",
    });
  } catch (error) {
    res.status(403).json({
      message: error,
    });
  }
};

const leaveRoom = async (req, res) => {
  const _id = req.params.id;

  const roomId = req.params.roomId;

  try {
    const user = await User.findOne({ _id }, { rooms: true });

    const filteredRooms = user.rooms.filter((r) => {
      return r.id !== roomId;
    });

    user.rooms = filteredRooms;

    user.save();

    res.status(201).json({
      message: "Removed Room Successfully",
    });
  } catch (error) {
    res.status(403).json({
      message: error,
    });
  }
};

module.exports = {
  findUserById,
  joinRoom,
  leaveRoom,
};
