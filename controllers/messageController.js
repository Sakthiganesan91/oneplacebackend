const Queries = require("../models/queryModel");
const User = require("../models/userModel");

module.exports.getMessageById = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const _id = req.params.id;

    const query = await Queries.findOne({ _id, roomId }).populate(
      "user",
      "username"
    );
    console.log(query);
    res.status(201).json({
      query: query,
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};

module.exports.getMessages = async (req, res) => {
  const roomId = req.params.roomId;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  console.log(roomId, page, limit);

  try {
    const queriesCount = (await Queries.find({ roomId })).length;

    const totalPages = Math.ceil(queriesCount / limit);

    const remainingPages = totalPages - page;

    const queries = await Queries.find({ roomId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user", "username");
    res.status(201).json({
      queries,
      remainingPages,
      totalPages,
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};
module.exports.postMessage = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const user = req.user;
    const title = req.body.queryTitle;
    const description = req.body.queryDescription;
    const detailsWanted = req.body.queryDetails;

    const query = await Queries.create({
      roomId,
      user,
      title,
      description,
      detailsWanted,
    });

    res.status(200).json({
      message: "upload successful",
      query: query,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      error,
    });
  }
};

module.exports.deleteQuery = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const _id = req.params.id;

    const query = await Queries.findOneAndDelete({ _id, roomId });

    res.status(201).json({
      message: "Deleted Successfully",
      query: query,
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};

module.exports.updateQuery = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const _id = req.params.id;
    const user = req.user;
    const title = req.body.queryTitle;
    const description = req.body.queryDescription;
    const detailsWanted = req.body.queryDetails;

    const query = await Queries.findOneAndUpdate(
      { _id, roomId },
      {
        roomId,
        user,
        title,
        description,
        detailsWanted,
      }
    );

    res.status(201).json({
      message: "Updated Successfully",
      query: query,
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};

//save a query to savedPost
module.exports.saveQuery = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = req.user;

    const selectedUser = await User.findById(user._id);

    console.log(selectedUser.savedPosts);

    const alreadyExists = selectedUser.savedPosts.find((id) => {
      return id.toString() === _id;
    });

    if (alreadyExists) {
      throw "Already exists";
    }
    selectedUser.savedPosts.push(_id);
    await selectedUser.save();

    res.status(201).json({
      message: "Save to Save Post",
    });
  } catch (error) {
    res.status(403).json({
      error: error,
    });
  }
};

//delete a savedQuery
module.exports.deleteSavedQuery = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = req.user;

    const selectedUser = await User.findById(user._id);
    const filteredArray = selectedUser.savedPosts.filter((id) => {
      return id.toString() !== _id;
    });

    selectedUser.savedPosts = filteredArray;
    await selectedUser.save();

    res.status(201).json({
      message: "Deleted From Saved Post",
    });
  } catch (error) {
    res.status(403).json({
      error: error,
    });
  }
};

//find whether the query is already saved or not
module.exports.isQuerySaved = async (req, res) => {
  try {
    const _id = req.params.id;

    const user = req.user;

    const selectedUser = await User.findById(user._id);

    console.log(selectedUser.savedPosts);

    const alreadyExists = selectedUser.savedPosts.find((id) => {
      return id.toString() === _id;
    });

    res.status(201).json({
      isQueryPresent: alreadyExists ? true : false,
    });
  } catch (error) {
    res.status(403).json({
      error,
    });
  }
};

//get the savedPosts
module.exports.getSavedPosts = async (req, res) => {
  const _id = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  console.log(page, limit);
  try {
    const savedPost = await User.findOne({ _id }, { savedPosts: true });

    const posts = savedPost.savedPosts.slice((page - 1) * limit, limit * page);

    const postsCount = savedPost.savedPosts.length;
    const totalPages = Math.ceil(postsCount / limit);

    const remainingPages = totalPages - page;
    const savedPosts = [];

    for (let i = 0; i < posts.length; i++) {
      try {
        const query = await Queries.findOne({ _id: posts[i] }).populate(
          "user",
          "username"
        );
        if (query === null) {
          console.log(posts[i]);
          savedPost.savedPosts = savedPost.savedPosts.filter((postId) => {
            return posts[i].toString() !== postId.toString();
          });

          continue;
        }
        savedPosts.push(query);
      } catch (error) {
        throw "Something Went Wrong";
      }
    }

    await savedPost.save();

    res.status(200).json({
      savedPosts,
      remainingPages,
      totalPages,
    });
  } catch (error) {
    res.status(402).json({
      error: error,
    });
  }
};

module.exports.likeQueryById = async (req, res) => {
  const _id = req.params.queryId;
  const user = req.user;
  try {
    const query = await Queries.findOne({ _id });

    const isUserLiked = query.useful.userIds.find((userId) => {
      return user._id.toString() === userId.toString();
    });

    if (isUserLiked) {
      const removedUserFromLikesArray = query.useful.userIds.filter(
        (userId) => {
          return userId.toString() !== user._id.toString();
        }
      );

      query.useful.userIds = removedUserFromLikesArray;
      query.useful.usefulCount -= 1;
      await query.save();
    } else {
      query.useful.userIds.push(user._id);
      query.useful.usefulCount += 1;
      await query.save();
    }

    res.status(201).json({
      query: query,
      message: "Liked Successfully",
    });
  } catch (error) {
    res.status(401).json({
      error,
    });
  }
};
