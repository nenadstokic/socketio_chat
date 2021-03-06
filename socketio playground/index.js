var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('user connected');
  
  socket.on('chat message', function(msg){
    socket.broadcast.emit('srv message', msg + " loool");
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');    
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
