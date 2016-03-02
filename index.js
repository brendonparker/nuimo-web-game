var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var driver = require('./driver')(io);

io.on('connection', function(socket){
    console.log('a user connected');
});

app.use(express.static("www"));

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});