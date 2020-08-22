
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatBot"

app.use(express.static(path.join(__dirname, '..', 'client')));
var connected_users = ['Admin']

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
      socket.broadcast.emit('message', {msg: welcomeMsg, sender:botName})
      socket.emit('message', {msg: 'Welcome! 🤗', sender:botName})
    }
    else {
      socket.emit('checkAvRes', 'TAKEN')
    }
  });

  socket.on('disconnect', () => {
    console.log('[-] Closed Connection');
    var byeMsg = socket.nickname + " Just Left... 😢"
    if(socket.nickname){socket.broadcast.emit('message', {msg: byeMsg, sender:botName})}
    connected_users.splice(connected_users.indexOf(socket), 1);
  });

  socket.on('chatMSG', big_msg => {
    socket.emit('message', big_msg);
    socket.broadcast.emit('message', big_msg);
  });
});
  

const port = process.env.PORT || 4242;
server.listen(port, () => console.log(`Server running on port ${port}`));