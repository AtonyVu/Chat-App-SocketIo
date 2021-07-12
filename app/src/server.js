const express = require("express");
const dateFormat = require("date-format");
const http = require("http");
const app = express();
const path = require("path");
const pathPublicDirectory = path.join(__dirname, "../public");

const socketIo = require("socket.io");
var Filter = require("bad-words");
var customFilter = new Filter({ placeHolder: "x" });
let userList = [];
customFilter.clean("Don't be an ash0le");
app.use(express.static(pathPublicDirectory));
const server = http.createServer(app);
const port = process.env.PORT || 5000;

///tao io de giao tiep client ////
const io = socketIo(server);
///ket noi server voi client
io.on("connection", (socket) => {
  socket.on("join-info-room", ({ Room, Name, sex }) => {
    socket.join(Room);
    userList.push({
      Name: Name,
      date: dateFormat("dd/MM/yyyy - hh:mm:ss", new Date()),
      id: socket.id,
      sex: sex,
    });
    socket.emit("join-room", { id1: socket.id, sex1: sex });
    io.to(Room).emit("new-join-room", userList);

    socket.on("client-to-server", (chat, callback) => {
      console.log(chat.chat);
      callback();
      socket.broadcast.to(Room).emit("server-to-client", {
        ...chat,
        user: Name,
        sex: sex,
        chat: customFilter.clean(chat.chat),
      });
    });
    socket.on("disconnect", () => {
      let list = userList.filter((item) => {
        return item.id != socket.id;
      });

      userList = [...list];
      io.to(Room).emit("dis-conect", userList);
      console.log(" client dis connect", Name);
    });
  });
});

server.listen(port, () => {
  console.log("app run on http://localhost:" + port);
});
