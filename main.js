const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const rooms = {};
app.use(express.static(path.join(__dirname, 'cli'))); //defines client


// -----------------------------------------------

app.get('/', (req, res) => {
    // Welcome! (enter as guest / login)
    res.sendFile(__dirname + '/cli/index.html')
});

app.get('/home', (req, res) => {
    res.send('Booted up.')
});

io.on('connection', (socket) => {
    console.log('user connected!') //detects connect
    socket.on('disconnect', () => {
        console.log('user disconnected.') //detects disconnect
    });

    socket.on('createGame', () => {
        const roomId = makeId(6);
        rooms[roomId] = {};
        socket.join(roomId);
        socket.emit("newGame", {roomId: roomId})
    })

    socket.on('joinGame', (data) => {
        if(rooms[data.roomId] != null) { //checks if room exists
            socket.join(data.roomId) //joins exiting room
            socket.to(data.roomId).emit("playerConnect", {}) //emitting player connect
            socket.emit("PlayerConnect");
        }
    })

});


server.listen(3000, () => {
    console.log('Port: 3000')
});


function makeId(length) {
    let Id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charsLength = chars.length;
    for (var i = 0; i < length; i++ ) {
        Id += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    console.log(Id)
    return Id;
}