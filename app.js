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
	// Adds current socket to list
	clients[socket.id] = socket;

	// Raise number of connected users
	countUsers++;

	// Create random username for user
	socket.username = "Guest" + Math.floor((Math.random() * 12344) + 1);

	// Create random color for user's messages
	socket.color = "color-" + Math.floor((Math.random() * 4) + 1);

	// Add current user's credentials to list
	onlineUsers.push({id: socket.id, username: socket.username});

	// Notify other users that user has connected
  	socket.broadcast.emit('user connected', "New user has connected: " + "Guest" + countUsers );
  	
  	// Handles new messages
	socket.on('chat message', function(msg, id, chatId) {

		// Check to whom to send new message
		if(id === "all") {
			io.emit('chat message', msg, socket.username,socket.color, "all", "all");
		} 
		// Private messages
		else {
			// Both users join same room
			socket.join(chatId);
			clients[id].join(chatId);

			// Send the new message to both users
			io.sockets.in(chatId).emit('chat message', msg, socket.username,socket.color, id, chatId);
		}
	});

	// Notify other users when someone is typing
	socket.on('user is typing', function(msg){
		socket.broadcast.emit('user is typing', msg);
	});

	// Notify other users when someone stops typing
	socket.on('user is not typing', function(msg){
		socket.broadcast.emit('user is not typing', msg);
	});

	// Change username
	socket.on('change nickname', function(nickname) {
		socket.username = nickname;
		for (var i = 0; i < countUsers; i++) {
			if(onlineUsers[i].id === socket.id) {
				onlineUsers[i].username = nickname;
			}
		};

		// Notify other users that user has changed his nickname
		socket.broadcast.emit('name change', nickname);
	});

	// When user disconnects
	socket.on('disconnect', function() {
		// Remove user from online list
		for (var i = 0; i < onlineUsers.length; i++) {
			if(onlineUsers[i].id === socket.id) {
				onlineUsers.splice(i,1);
			}
		};
		// Decrease online users count
		countUsers--;

		// Notify other users that user has disconnected
		socket.broadcast.emit('user disconnect');
  	});

});

// Create server
http.listen(3000, function(){
  console.log('listening on *:3000');
});