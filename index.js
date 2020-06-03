var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var users = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('a user connected');
  users[socket.id] = { name: '' };
  io.emit('new user', {});

  socket.on('disconnect', () => {
    let userId = socket.id;
    console.log('user disconnected ' + userId);
    delete users[userId];
    //socket.broadcast.emit();
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});
