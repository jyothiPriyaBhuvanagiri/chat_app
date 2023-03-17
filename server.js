const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const chatMessage =require("./util/messages")
const {userJoin, currentUser, getRoomUsers, userLeft} =require("./util/user")

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// to access the frontend we need a static folder we use express middleware express.static
app.use(express.static(path.join(__dirname, "public")));
const botName="bot"


// handle new connections
io.on("connection", socket => {
  console.log("A user connected");

  socket.on("joinRoom",({username, room}) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)

    // emit a welcome message to the client
    socket.emit("message", chatMessage(botName , "Welcome to the chat"));

    // handle messages from the client
    socket.on("message", (message) => {
      console.log(`Received message: ${message}`);

      // broadcast the message to all clients $$ and for the single client
      io.emit("message", message);
    });

    // broadcast when a user connects $$ for all the clients except the connecting one
    socket.broadcast.to(user.room).emit("message", chatMessage(botName, `${user.username} has joined`));

      })

  // listen to the chat message
  socket.on("chatMessage", (msg) =>{

    const user =currentUser(socket.id)
    io.to(user.room).emit("message", chatMessage(`${user.username}`,msg))
  })
  // handle disconnections
  socket.on("disconnect", () => {
    const user = userLeft(socket.id)

    if(user){
      // emit a message to all clients when a user disconnects
      io.to(user.room).emit("message", chatMessage(botName, `${user.username} has left the room`));
    }

  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});