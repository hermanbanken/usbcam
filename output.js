module.exports = { output };

// Source: https://socket.io/get-started/chat
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on http://localhost:3000');
});

function output(pixels) {
    io.emit("pixels", pixels);
}

function outputPixel(data) {
    io.emit("pixel", data);
}

function outputInfo(data) {
    io.emit("info", data);
}

module.exports = { output, outputPixel, outputInfo };