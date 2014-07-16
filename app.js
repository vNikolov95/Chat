var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [];
var onlineUsers = [];
var countUsers = 0;
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/users', function(req, res){
	res.contentType('application/json');
	res.send(JSON.stringify(onlineUsers));
	res.end();
});

io.on('connection', function(socket){
	clients[socket.id] = socket;
	countUsers++;
	socket.username = "Guest" + Math.floor((Math.random() * 12344) + 1);
	socket.color = "color-" + Math.floor((Math.random() * 4) + 1);
	onlineUsers.push({id: socket.id, username: socket.username});

  	socket.broadcast.emit('user connected', "New user has connected: " + "Guest" + countUsers );
  	
	socket.on('chat message', function(msg, id, chatId) {
		if(id === "all") {
			io.emit('chat message', msg, socket.username,socket.color, "all", "all");
		} else {
			socket.join(chatId);
			clients[id].join(chatId);
			//socket.to(id).emit('chat message', msg, socket.username,socket.color, socket.id);
			io.sockets.in(chatId).emit('chat message', msg, socket.username,socket.color, id, chatId);
		}
	});

	socket.on('user is typing', function(msg){
		socket.broadcast.emit('user is typing', msg);
	});

	socket.on('user is not typing', function(msg){
		socket.broadcast.emit('user is not typing', msg);
	});

	socket.on('change nickname', function(nickname) {
		socket.username = nickname;
		for (var i = 0; i < countUsers; i++) {
			if(onlineUsers[i].id === socket.id) {
				onlineUsers[i].username = nickname;
			}
		};
		socket.broadcast.emit('name change', nickname);
	});

	socket.on('disconnect', function() {
		for (var i = 0; i < onlineUsers.length; i++) {
			if(onlineUsers[i].id === socket.id) {
				onlineUsers.splice(i,1);
			}
		};
		countUsers--;
		socket.broadcast.emit('user disconnect');
  	});

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});