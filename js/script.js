/*
We store our game status element here to allow us to more easily
use it later on
*/
/*
Post data
 */



theUrl = "http://localhost:1111/items";
cleanArrayUrl = "http://localhost:1111/clean_array";

const statusDisplay = document.querySelector('.game--status');
const logging = document.querySelector('.game--log');
let gameActive = true;
var gameState = ["", "", "", "", "", "", "", "", ""];
let arrayOfplayers = ["", "", "", "", "", "", "", "", ""];
let arrayOfloc = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = 'X';

console.log(getRequest());
//var div = document.querySelector('.game--container');
//var diva = document.querySelector('.game--log');
//while(div.firstChild) {
//    div.removeChild(div.firstChild);
//}
//for (let i = 0; i<=8; i++) {
//div.innerHTML += '<div data-cell-index=\"'+i+'\"class=\"cell\">'+gameState[i]+'</div>';
//console.log('<div data-cell-index=\"'+i+'\"class=\"cell\">'+gameState[i]+'</div>');
//                    console.log('<div data-cell-index=\"'+i+'\"class=\"cell\">'+gameState[i]+'</div>');
//}


const winningMessage = () => `Player ${currentPlayer} has won!!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
/*
We set the inital message to let the players know whose turn it is
*/
statusDisplay.innerHTML = currentPlayerTurn();

function handleCellPlayed() {

}
function handlePlayerChange() {

}
function handleResultValidation() {

}
function handleCellClick() {

}
function handleRestartGame() {

}



document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);


function handleCellClick(clickedCellEvent) {
    /*
    We will save the clicked html element in a variable for easier further use
    */
    const clickedCell = clickedCellEvent.target;
    /*
    Here we will grab the 'data-cell-index' attribute from the clicked cell to identify where that cell is in our grid.
    Please note that the getAttribute will return a string value. Since we need an actual number we will parse it to an
    integer(number)
    */
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-cell-index')
    );
    /*
    Next up we need to check whether the call has already been played,
    or if the game is paused. If either of those is true we will simply ignore the click.
    */
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    /*
    If everything if in order we will proceed with the game flow
    */
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    /*
    We update our internal game state to reflect the played move,
    as well as update the user interface to reflect the played move
    */
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;


    //Send POST to the server with Loc and Player:
    postRequest(clickedCellIndex);


    //GET data for the LOG
    getRequest();
}


const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];



function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }
    /*
    We will check weather there are any values in our game state array
    that are still not populated with a player sign
    */
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }
    /*
    If we get to here we know that the no one won the game yet,
    and that there are still moves to be played, so we continue by changing the current player.
    */
    handlePlayerChange();
}


function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();

}



function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    clearScreenAndArrays();
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    fetch(cleanArrayUrl);
    document.querySelectorAll('.cell')
        .forEach(cell => cell.innerHTML = "");
}


function clearScreenAndArrays() {
    var div = document.querySelector('.game--log');
    arrayOfplayers = [];
    arrayOfloc = [];
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }

}


function postRequest(clicked) {
    clickedCellIndex=clicked;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", theUrl, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
        }
    }

    xhr.send( "id=" + clickedCellIndex + "&player=" + currentPlayer );
}





function getRequest() {
    fetch(theUrl)
        .then(res => {
            return res.json();
        })
        .then(data => {
            clearScreenAndArrays();
            var div = document.querySelector('.game--log');
            logging.innerHTML = "<ul>"
            data.f
            data.forEach(element => gameState[Number(element.id)]=String(element.player));orEach(element => logging.innerHTML +="<li>"+ "Player " + (element.player) + " moved to " + (Number(element.id)+1))+"</li>";
            logging.innerHTML += "</ul>"
            console.log(gameState);
        });

    return gameState;

}

