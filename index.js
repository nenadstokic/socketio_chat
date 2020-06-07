const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const randomname = require('random-name');

let users = {};

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('new socketio connection ' + socket.id);

  let user = {
    name: randomname.first(),
    messages: 0
  };
  users[socket.id] = user;

  io.emit('newUser', users, socket.id);

  socket.on('nickChanged', function(name) {
    io.emit('newName', socket.id, name);
  });

  socket.on('disconnect', function() {
    delete users[socket.id];
    io.emit('userGone', socket.id);
  });

  socket.on('newMessage', msg => {
    socket.broadcast.emit('incomingMessage', msg, socket.id);
  });

  socket.on('userInputDetected', id => {
    socket.broadcast.emit('userIsTyping', id);
  });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});
