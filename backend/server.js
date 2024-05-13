const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data.js");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { errorHandler, notFound } = require("./middleware/errorMiddleware.js");

const app = express();

dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000, //if user doesnot send any message for 60sec then server is gonna close the connection to save bandwidth
  cors: "https://localhost:3000",
});

io.on("connection", (socket) => {
  // console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat) return console.log("chat.users not found!");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    // console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
