const Comments = require("../models/CommentModel");

module.exports.getCommentById = async (req, res) => {
  try {
    const queryId = req.params.queryId;
    const _id = req.params.commentId;

    const comment = await Comments.findOne({ _id, queryId });

    res.status(201).json({
      comment: comment,
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};

module.exports.getComments = async (req, res) => {
  const queryId = req.params.queryId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const comments = await Comments.find({ queryId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user", "username");
    res.status(201).json({
      comments,
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

module.exports.postComment = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const queryId = req.params.queryId;
    const comment = req.body.comment;
    const user = req.user;

    await Comments.create({
      roomId,
      user,
      queryId,
      comment,
    });

    res.status(200).json({
      message: "upload successful",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error,
    });
  }
};

module.exports.deleteCommetById = async (req, res) => {
  try {
    const _id = req.params.commentId;

    await Comments.findOneAndDelete({ _id });

    res.status(201).json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};

module.exports.updateCommentById = async (req, res) => {
  try {
    const _id = req.params.commentId;
    const comment = req.body.com;

    await Comments.findOneAndUpdate(
      { _id },
      {
        comment,
      }
    );

    res.status(201).json({
      message: "Updated Successfully",
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};

module.exports.likeCommentById = async (req, res) => {
  const _id = req.params.commentId;
  const user = req.user;
  try {
    const comment = await Comments.findOne({ _id });

    const isUserLiked = comment.upVote.userIds.find((userId) => {
      return user._id.toString() === userId.toString();
    });

    if (isUserLiked) {
      const removedUserFromLikesArray = comment.upVote.userIds.filter(
        (userId) => {
          return userId.toString() !== user._id.toString();
        }
      );

      comment.upVote.userIds = removedUserFromLikesArray;
      comment.upVote.count -= 1;
      await comment.save();
    } else {
      comment.upVote.userIds.push(user._id);
      comment.upVote.count += 1;
      await comment.save();
    }

    res.status(201).json({
      comment: comment,
      message: "Liked Successfully",
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};
