$(function() {
  var socket = io();
  var users = {};

  socket.on('userGone', id => {
    // $('#participants>li:contains(users[id])').remove();
    showMessage(users[id].name + ' has left the chat.', 0);
    delete users[id];
    refreshUserlist(users);
  });
  socket.on('newUser', function(allusers, id) {
    users = { ...allusers };
    let user = users[id];
    $('#messages').append(
      $('<li class="italic">').text(user.name + ' has just logged in.')
    );
    refreshUserlist(allusers);

    // users.keys.forEach((singleuser, counter) => {
    //   $('#participants').append($('<li>').text(counter + ' ' + singleuser));
    // });

    console.log(users);
  });

  socket.on('incomingMessage', (msg, id) => {
    $('#messages').append($('<li>').text(users[id].name + ':' + msg));
  });

  socket.on('newName', function(id, name) {
    $('#messages').append(
      $('<li class="italic">').text(
        users[id].name + ' changed his name to ' + name
      )
    );
    users[id].name = name;
    refreshUserlist(users);
  });

  socket.on('userIsTyping', id => {
    console.log(users[id].name + ' is typing...');

    var selector = '#participants>li:contains(' + users[id].name + ')'; //  'p:contains(' + vtxt + ')';

    $(selector).text(users[id].name + ' is typing...');
    setTimeout(function() {
      $(selector).text(users[id].name);
      console.log(users[id].name + ' stopped typing...');
    }, 2000);
  });

  $('#nick').click(function(e) {
    e.preventDefault();
    let newNick = prompt('Enter your username');
    socket.emit('nickChanged', newNick);
    $('#nick').text(newNick);
  });

  $('#send').click(function(e) {
    e.preventDefault();
    let msg = $('#m').val();
    socket.emit('newMessage', msg);
    $('#messages').append($('<li>').text(msg));
    $('#m').val('');
    return false;
  });

  $('#m').on('input', function() {
    socket.emit('userInputDetected', socket.id);
    console.log(socket.id);
  });

  var messageTimer;
  function showMessage(message, type) {
    if (type === 0) {
      $('#notification').attr('class', 'errorColor');
    }
    if (type === 1) {
      $('#notification').attr('class', 'infoColor');
    }
    $('#notification').text(message);
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => {
      $('#notification').text('');
    }, 3000);
  }

  function refreshUserlist(obj) {
    $('#participants').empty();
    for (let u in obj) {
      $('#participants').append($('<li>').text(obj[u].name));
      //console.log(u, allusers[u]);
    }
  }
});
