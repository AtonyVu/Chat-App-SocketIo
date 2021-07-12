const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const pathPublicDirectory = path.join(__dirname, "../public");

const socketIo = require("socket.io");
var Filter = require("bad-words");
var customFilter = new Filter({ placeHolder: "x" });

customFilter.clean("Don't be an ash0le");
app.use(express.static(pathPublicDirectory));
const server = http.createServer(app);
const port = process.env.PORT || 5000;

///tao io de giao tiep client ////
const io = socketIo(server);
///ket noi server voi client
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log(" client dis connect", socket.id);
  });
  socket.on("join-info-room", ({ Room, Name }) => {
    socket.join(Room);
    socket.emit("join-room", "Welcom " + Name);
    socket.broadcast.to(Room).emit("new-join-room", Name);
    socket.on("client-to-server", (chat, callback) => {
      console.log(chat.chat);
      callback();
      socket.broadcast.to(Room).emit("server-to-client", {
        ...chat,
        user: socket.id,
        chat: customFilter.clean(chat.chat),
      });
    });
  });
});

io.on("disconnect", (socket) => {
  console.log("out connect", socket.id);
});
server.listen(port, () => {
  console.log("app run on http://localhost:" + port);
});
