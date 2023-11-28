// set up server
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // to interact with mongoDB server
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");

const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());

// Using middleware to parse incoming JSON data
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

// connect Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT} `);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// create a node.js global object
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    // console.log("sendmsg", { data });
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
