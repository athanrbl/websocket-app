const socket = io();
let roomId = null;

function createGame() {
    socket.emit('createGame')
}

function joinGame() {
    roomId = document.getElementById('roomId').value
    socket.emit('joinGame', {roomId: roomId})
}

socket.on("newGame", (data) => { //creating new game
    roomId = data.roomId;
    document.getElementById('initial').style.display = 'none'
    document.getElementById('gameRoom').style.display = 'block'
    
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
    document.getElementById('waitingRoom').style.display = 'none' //get rid of waiting area
    //document.getElementById('gameRoom').style.display = 'block'

})