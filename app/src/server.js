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
const port = 5000;

///tao io de giao tiep client ////
const io = socketIo(server);
///ket noi server voi client
io.on("connection", (socket) => {
  socket.emit("join-room", "Welcom welcom");
  socket.broadcast.emit("new-join-room", "Có 1 bé mới join room");
  socket.on("disconnect", () => {
    console.log(" client dis connect", socket.id);
  });

  socket.on("client-to-server", (chat, callback) => {
    console.log(chat.chat);
    callback();
    socket.broadcast.emit("server-to-client", {
      ...chat,
      user: socket.id,
      chat: customFilter.clean(chat.chat),
    });
  });
});

io.on("disconnect", (socket) => {
  console.log("out connect", socket.id);
});
server.listen(port, () => {
  console.log("app run on http://localhost:" + port);
});
