const express = require("express");
const app = express();
const io = require("socket.io")(app.listen());
const ALL_SOCKETS = {};
const ALL_ROOMS = {};
io.sockets.on("connection", socket => {
  let id = Math.random();
  socket.id = id;

});

class Game {
  constructor(userNum,name,username, password, socket) {
    this.password = password;
    this.userNum = userNum;
    this.user={...socket,username};
    this.users=[user];
    this.username=username;
    if (!Object.keys(ALL_ROOMS).includes(name)) {
      if (password == ALL_ROOMS[name].password) {
        this.room = ALL_ROOMS[name].password;
        this.room.users.push(user);
      } else {
        name = Math.floor(Math.random() * 10 ^ 5);
        socket.emit("start reject name", name);
      }
    } else {
      ALL_ROOMS[name] = this.room = {
        password,
        userNum,
        users
      };
    }
    socket.on("gameEvent", (eventName, ...params) => {

    });
    socket.on("disconnect", () => {
      room.emit("disconnect",room.emit("disconnect",this.username))
    })
  }
