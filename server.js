const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// to access the frontend we need a static folder we use express middleware express.static
app.use(express.static(path.join(__dirname, "public")));

// handle new connections
io.on("connection", socket => {
  console.log("A user connected");

  // emit a welcome message to the client
  socket.emit("message", "Welcome to the chat");

  // handle messages from the client
  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // broadcast the message to all clients $$ and for the single client
    io.emit("message", message);
  });

  // broadcast when a user connects $$ for all the clients except the connecting one
  socket.broadcast.emit("message", "A user has joined");

  // handle disconnections
  socket.on("disconnect", () => {
    // emit a message to all clients when a user disconnects
    io.emit("message", "A user has left the chat");
  });

  // listen to the chat message
  socket.on("chatMessage", (msg) =>{
    io.emit("message",msg)
  })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});