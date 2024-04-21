const socket = io();
let roomId = null;
let player1 = false;

function createGame() {
    player1 = true
    socket.emit('createGame')
}

function joinGame() {
    roomId = document.getElementById('roomId').value
    socket.emit('joinGame', {roomId: roomId})
}

socket.on("newGame", (data) => { //creating new game
    roomId = data.roomId;
    document.getElementById('initial').style.display = 'none'
    document.getElementById('waitingRoom').style.display = 'block'
    
    let clipboardBtn = document.createElement('button') //copy to clipboard button
    clipboardBtn.style.display = 'block'
    clipboardBtn.innerText = 'Copy to Clipboard'
    clipboardBtn.addEventListener('click', () => {
        //console stuff
        navigator.clipboard.writeText(roomId).then(function() {
            console.log('copied')
        }, function(err) {
            console.error('copy err: ', err)
        })
    })

    document.getElementById('waitingRoom').innerHTML = `Share ${roomId} to an opponent.` //show code
    document.getElementById('waitingRoom').appendChild(clipboardBtn) //show clipboard button
})

socket.on("playerConnect", () => {
    document.getElementById('initial').style.display = 'none'
    document.getElementById('waitingRoom').style.display = 'none' //get rid of waiting area
    document.getElementById('gameRoom').style.display = 'block' //bring game room
})

socket.on("p1Choice", (data) => {
    if(!player1) {
        playerChosen(data) //display that p1 chose to p2
    }
})

socket.on("p2Choice", (data) => {
    if(player1) {
        playerChosen(data) //display that p2 chose to p1
    }
})

socket.on("result", (data) => {
    let resultText = '';
    if(data.winner != 'd') {
        if(data.winner == 'p1' && player1) {
            resultText = 'You win';
        } else if(data.winner == 'p1') {
            resultText = 'You lose';
        } else if(data.winner == 'p2' && !player1) {
            resultText = 'You win';
        } else if(data.winner == 'p2') {
            resultText = 'You lose';
        }
    } else {
        resultText = `It's a draw`;
    }
    document.getElementById('choice2').style.display = 'none';
    document.getElementById('endscreen').innerHTML = resultText;
})

function sendChoice(playerChoice) {
    const choiceEvent = player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent, {
        playerChoice: playerChoice,
        roomId: roomId
    })
    document.getElementById('choice1').innerHTML = ""
    let choice = document.createElement('h3')
    choice.style.display = 'block'
    choice.innerText = playerChoice
    document.getElementById('choice1').appendChild(choice)
}

function playerChosen() {
    document.getElementById('choice2').innerHTML = "Game waiting on you.";
}