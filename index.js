var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var users = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('socketio connection');

  socket.on('connectUser', (id, nick) => {
    console.log('connectUser došao iz klijenta');
    console.log(id);
    console.log(nick);
    users[id] = {
      userId: id,
      nick: nick
    };
    //console.log(users);

    socket.broadcast.emit('allUsers', { users });
  });

  // socket.on('disconnectUser', user => {
  //   let msg = user.nick + ' has left.';
  //   socket.broadcast.emit('incomingMessage', msg);
  // });

  socket.on('disconnect', () => {
    let userId = socket.id;
    //console.log('svi useri');
    //console.log(users);

    let msg = 'user has left.';
    socket.broadcast.emit('incomingMessage', msg);
    console.log('user disconnected ' + userId);
    delete users[userId];
    //socket.broadcast.emit();
  });

  socket.on('newMessage', msg => {
    socket.broadcast.emit('incomingMessage', msg);
  });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});
