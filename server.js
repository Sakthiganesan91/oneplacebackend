const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authenticationRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const commentRoutes = require("./routes/commentRoutes");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "50mb" }));

app.use(authRoutes);
app.use(userRoutes);
app.use(messageRoutes);
app.use(commentRoutes);
mongoose
  .connect(process.env.MONGOOSE_DB_URI)
  .then(() => {
    app.listen(process.env.PORT || 7000);
    console.log("Connected at port 8081");
  })
  .catch((err) => {
    console.log("Error with Connecting to database", err);
  });

// mongodb+srv://oneplaceadmin:oneplaceadmin@cluster0.tmcvyhu.mongodb.net/oneplacelearning?retryWrites=true&w=majority
