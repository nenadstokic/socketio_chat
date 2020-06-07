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

  console.log(users);

  io.emit('newUser', users, socket.id);

  socket.on('nickChanged', function(name) {
    console.log('new name of ' + socket.id + ' is ' + name);
    io.emit('newName', socket.id, name);
  });

  socket.on('disconnect', function() {
    //console.log(users[socket.id].name + ' with id ' + socket.id + ' has left.');
    delete users[socket.id];
    io.emit('userGone', socket.id);
    console.log('deleting ' + socket.id);
  });

  socket.on('newMessage', msg => {
    socket.broadcast.emit('incomingMessage', msg, socket.id);
  });

  socket.on('userInputDetected', id => {
    console.log('user ' + id + ' is typing...');
    socket.broadcast.emit('userIsTyping', id);
  });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});
