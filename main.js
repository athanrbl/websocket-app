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
        const roomId = makeId(5);
        rooms[roomId] = {};
        socket.join(roomId);
        socket.emit("newGame", {roomId: roomId})
    })

    socket.on('joinGame', (data) => {
        if(rooms[data.roomId] != null) { //checks if room exists
            socket.join(data.roomId) //joins exiting room
            socket.to(data.roomId).emit("playerConnect", {}) //emitting player connect
            socket.emit("playerConnect");
        }
    })

    socket.on("p1Choice", (data) => {
        let playerChoice = data.playerChoice;
        rooms[data.roomId].p1Choice = playerChoice;
        socket.to(data.roomId).emit("p1Choice",{playerChoice : data.playerChoice}); //emits p1 made choice
        if(rooms[data.roomId].p2Choice != null) {
            winFunc(data.roomId)
        }
    })

    socket.on("p2Choice", (data) => {
        let playerChoice = data.playerChoice;
        rooms[data.roomId].p2Choice = playerChoice;
        socket.to(data.roomId).emit("p2Choice",{playerChoice : data.playerChoice}); //emits p2 made choice
        if(rooms[data.roomId].p1Choice != null) {
            winFunc(data.roomId)
        }
    })
});

function winFunc(roomId) {
    let p1Choice = rooms[roomId].p1Choice;
    let p2Choice = rooms[roomId].p2Choice;
    let winner = null;
    if (p1Choice === p2Choice) {
        winner = "d";
    } else if (p1Choice == "Paper") {
        if (p2Choice == "Scissors") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    } else if (p1Choice == "Rock") {
        if (p2Choice == "Paper") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    } else if (p1Choice == "Scissors") {
        if (p2Choice == "Rock") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    }
    io.sockets.to(roomId).emit("result", {
        winner: winner
    });
    rooms[roomId].p1Choice = null;
    rooms[roomId].p2Choice = null;
}


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