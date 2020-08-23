
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatBot"

app.use(express.static(path.join(__dirname, '..', 'client')));
var connected_users = []
var all_messages = []
var admins = ['Admin']

function getTime(){
  var d = new Date();
  var h = d.getHours().toLocaleString();
  if (h.length == 1){
      h = '0' + h;
  }
  var m = d.getMinutes().toLocaleString();
  if (m.length == 1){
      m = '0' + m;
  }
  return h + ":" + m;
}

function isConnected(user) {
  for(i = 0; i < connected_users.length; i++) {
    if (connected_users[i] == user){
      return true;
    }
  }
  return false;
}

io.on('connection', (socket) => {
  console.log('[+] New Connection');
  socket.on('checkAv', (user) => {
    if(!(isConnected(user))) {
      connected_users.push(user);
      socket.nickname = user;
      socket.emit('checkAvRes', 'ACCEPT')
      var welcomeMsg = socket.nickname + " Has Joined! 🤗"
      socket.broadcast.emit('message', {time:getTime(), msg: welcomeMsg, sender:botName})
    }
    else {
      socket.emit('checkAvRes', 'TAKEN')
    }
  });
  socket.on('imIn', () => {
    socket.emit('message', {msg: 'Welcome! 🤗', time:getTime(), sender:botName});
  });

  socket.on('disconnect', () => {
    console.log('[-] Closed Connection');
    var byeMsg = socket.nickname + " Has Left... 😢"
    var res = {time:getTime(), msg: byeMsg, sender:botName};
    if(socket.nickname){socket.broadcast.emit('message', res)}
    connected_users.splice(connected_users.indexOf(socket), 1);
  });

  socket.on('chatMSG', big_msg => {
    var res = {time:getTime(), sender:big_msg.sender, msg:big_msg.msg};
    socket.emit('message', res);
    socket.broadcast.emit('message', res);
    all_messages.push(res);
  });

  socket.on('loadChat', () =>
  {
    for(i=0;i<all_messages.length;i++){
      socket.emit('message',all_messages[i]);
    }
  });

});
  

const port = process.env.PORT || 4242;
server.listen(port, () => console.log(`Server running on port ${port}`));