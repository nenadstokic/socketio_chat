var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('a user connected');
  io.emit('new user', {
    userId: socket.id,
    message: 'a user connected'
  });
  console.log(socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    //socket.broadcast.emit();
  });

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});
