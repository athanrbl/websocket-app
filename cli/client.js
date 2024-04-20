console.log("test")

var socket = io();

function createGame() {
    socket.emit('createGame');
}