
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const CELL_SIZE = 200;

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let currentPlayer = "X";
let winner = null;
let gameOver = false;


// Draw the board and pieces
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPieces();
}


// Draw the grid lines
function drawGrid() {
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.beginPath();

    ctx.moveTo(200, 0);
    ctx.lineTo(200, 600);

    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);

    ctx.moveTo(0, 200);
    ctx.lineTo(600, 200);

    ctx.moveTo(0, 400);
    ctx.lineTo(600, 400);

    ctx.stroke();
}


// Handle the human player's X move
function handleClick(event) {
    if (gameOver || currentPlayer !== "X") {
        return;
    }

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (event.clientX - rect.left) * canvas.width / rect.width;

    const mouseY =
        (event.clientY - rect.top) * canvas.height / rect.height;

    const col = Math.floor(mouseX / CELL_SIZE);
    const row = Math.floor(mouseY / CELL_SIZE);

    if (row < 0 || row > 2 || col < 0 || col > 2) {
        return;
    }

    const index = row * 3 + col;

    // Only place X in an empty square
    if (board[index] !== "") {
        return;
    }

    board[index] = "X";
    drawBoard();

    // Check whether X won
    winner = checkWinner();

    if (winner) {
        endGame("Player X Wins!");
        return;
    }

    // Check for a draw
    if (board.every(square => square !== "")) {
        endGame("It's a Draw!");
        return;
    }

    // Computer takes its turn
    currentPlayer = "O";
    statusText.textContent = "Computer O is thinking...";

    computerMove();
}


// Choose a random open square for O
function computerMove() {
    if (gameOver) {
        return;
    }

    // Find all empty squares
    const openSlots = [];

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            openSlots.push(i);
        }
    }

    // If no squares remain, the game is over
    if (openSlots.length === 0) {
        endGame("It's a Draw!");
        return;
    }

    // Generate a random number to select an open square
    const randomIndex = Math.floor(Math.random() * openSlots.length);

    const chosenSlot = openSlots[randomIndex];

    // Place O only in the chosen empty square
    board[chosenSlot] = "O";

    drawBoard();

    // Check whether O won
    winner = checkWinner();

    if (winner) {
        endGame("Computer O Wins!");
        return;
    }

    // Check for a draw after O's move
    if (board.every(square => square !== "")) {
        endGame("It's a Draw!");
        return;
    }

    // Give the turn back to the human player
    currentPlayer = "X";
    statusText.textContent = "Your Turn (X)";
}


// Check all possible winning combinations
function checkWinner() {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const line of lines) {
        const [a, b, c] = line;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }

    return null;
}


// Display X and O on the canvas
function drawPieces() {
    for (let i = 0; i < board.length; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;

        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        if (board[i] === "X") {
            drawX(x, y);
        } else if (board[i] === "O") {
            drawO(x, y);
        }
    }
}


// Draw an X
function drawX(x, y) {
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "black";

    ctx.moveTo(x + 30, y + 30);
    ctx.lineTo(x + 170, y + 170);

    ctx.moveTo(x + 170, y + 30);
    ctx.lineTo(x + 30, y + 170);

    ctx.stroke();
}


// Draw an O
function drawO(x, y) {
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "black";

    ctx.arc(x + 100, y + 100, 70, 0, Math.PI * 2);
    ctx.stroke();
}


// End the game
function endGame(message) {
    gameOver = true;
    statusText.textContent = message;
}


// Reset the game
function resetGame() {
    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    currentPlayer = "X";
    winner = null;
    gameOver = false;

    statusText.textContent = "Your Turn (X)";

    drawBoard();
}


// Set up event listeners
canvas.addEventListener("click", handleClick);
resetBtn.addEventListener("click", resetGame);


// Start the game
statusText.textContent = "Your Turn (X)";
drawBoard();
