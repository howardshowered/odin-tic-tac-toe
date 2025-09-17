function Cell() 
{
    let value = '';

    const getValue = () => value;
    const setValue = (newValue) => { value = newValue; };
    const isEmpty = () => value === '';
    const reset = () =>  { value = '' };

    return { getValue, setValue, isEmpty, reset };
}

//GameBoard Object
function GameBoard() 
{
    const row = 3;
    const col = 3;
    const board = [];
    
    //Initialize the board with empty cells
    for (let i = 0; i < row; i++) {
        const newRow = [];
        for (let j = 0; j < col; j++) {
            newRow.push(Cell());
        }
        board.push(newRow);
    };
    const getBoard = () => board;
    const resetBoard = () => {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                board[i][j].reset();
            }
        }

        for (let i = 0; i < row; i++) {
        const newRow = [];
        for (let j = 0; j < col; j++) {
            newRow.push(Cell());
        }
        board.push(newRow);
        };
    };
    
    return { board, getBoard, resetBoard };

}

function GameController( 
    playerOneName = "Player 1",
    playerTwoName = "Player 2"
) {
    const playerOne = { name: playerOneName, symbol: 'X' };
    const playerTwo = { name: playerTwoName, symbol: 'O' };
    let currentPlayer = playerOne;
    let round = 0;
    const maxRounds = 9;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    };

    const getCurrentPlayer = () => currentPlayer;

    const incrementRound = () => { round++; };
    const getRound = () => round;
    const isGameOver = () => gameOver;

    return { switchPlayer, getCurrentPlayer, incrementRound, getRound, isGameOver };


}
const playRound = (gameController, gameBoard, row, col) => {
    if (gameController.isGameOver()) {
        console.log("Game is already over.");
        return;
    }

    if (row < 0 || row >= 3 || col < 0 || col >= 3) {
        console.log("Invalid move. Row and Column must be between 0 and 2.");
        return;
    }

    const cell = gameBoard.getBoard()[row][col];
    if (!cell.isEmpty()) {
        console.log("Cell is already occupied. Choose another cell.");
        return;
    }

    const currentPlayer = gameController.getCurrentPlayer();
    cell.setValue(currentPlayer.symbol);
    gameController.incrementRound();

    const checkWin = (symbol) => {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (gameBoard.getBoard()[i][0].getValue() === symbol && gameBoard.getBoard()[i][1].getValue() === symbol && gameBoard.getBoard()[i][2].getValue() === symbol) {
                return true;
            }
            if (gameBoard.getBoard()[0][i].getValue() === symbol && gameBoard.getBoard()[1][i].getValue() === symbol && gameBoard.getBoard()[2][i].getValue() === symbol) {
                return true;
            }
        }
        // Check diagonals
        if (gameBoard.getBoard()[0][0].getValue() === symbol && gameBoard.getBoard()[1][1].getValue() === symbol && gameBoard.getBoard()[2][2].getValue() === symbol) {
            return true;
        }
        if (gameBoard.getBoard()[0][2].getValue() === symbol && gameBoard.getBoard()[1][1].getValue() === symbol && gameBoard.getBoard()[2][0].getValue() === symbol) {
            return true;
        }
        return false;
    };

    // Check for win or draw conditions here (not implemented in this snippet)
    if(gameController.getRound() >= 5) {
        // Check rows, columns, and diagonals for a win

        if (checkWin(currentPlayer.symbol)) {
            screenController.renderBoard(gameBoard.getBoard());
            console.log(`${currentPlayer.name} wins!`);
            gameController.gameOver = true;
  
            alert(`${currentPlayer.name} wins!`);
            // gameController.gameOver = false;
            gameController.round = 0;
            gameBoard.resetBoard();
            screenController.renderBoard(gameBoard);
            // screenController.updateTurn(gameController.getCurrentPlayer());
            return;
        } else if (gameController.getRound() === gameController.maxRounds) {
            console.log("It's a draw!");
            gameController.gameOver = true;
                        alert("It's a draw!");
            // gameController.gameOver = false;
            gameController.round = 0;
            gameBoard.resetBoard(); 
            screenController.renderBoard(gameBoard.getBoard());
            screenController.updateTurn(gameController.getCurrentPlayer());
            return;
        }
    }

    console.log(`Round ${gameController.getRound()}: ${currentPlayer.name} placed ${currentPlayer.symbol} at (${row}, ${col})`);

    // if(!gameController.isGameOver()) {
    //     console.log(`It's ${gameController.getCurrentPlayer().name}'s turn.`);
    // } else {
    //     console.log("Game Over.");
    //     alert("Game Over.");
    // }

    gameController.switchPlayer();
}

function ScreenController() {
    const boardElement = document.querySelector('.board');
    const turnElement = document.querySelector('.turn');

    const renderBoard = (gameBoard) => {
        boardElement.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.dataset.row = i;
                cellDiv.dataset.col = j;
                cellDiv.textContent = gameBoard[i][j].getValue();
                boardElement.appendChild(cellDiv);
            }
        }
    };

    function clickHandlerBoard(e) {
        if(gameController.isGameOver()) {
            return;
        }
        const selectedColumn = e.target.dataset.col;
        const selectedRow = e.target.dataset.row;
        if (selectedColumn === undefined || selectedRow === undefined) {
            return;
        }
        playRound(gameController, gameBoard, selectedRow, selectedColumn);
        renderBoard(gameBoard.getBoard());
        if (!gameController.isGameOver()) {
            updateTurn(gameController.getCurrentPlayer());
        } else {
            turnElement.textContent = "Game Over.";
        }
    }

    boardElement.addEventListener('click', clickHandlerBoard);

    const updateTurn = (currentPlayer) => {
        turnElement.textContent = `It's ${currentPlayer.name}'s turn.`;
    };



    return { renderBoard, updateTurn };
}
// console.log("Tic Tac Toe Game Initialized");
// console.log("Player 1: X, Player 2: O");
const gameBoard = GameBoard();
const gameController = GameController("Alice", "Bob");
const screenController = ScreenController();
screenController.renderBoard(gameBoard.getBoard());
screenController.updateTurn(gameController.getCurrentPlayer());
    
console.log("Tic Tac Toe Game Initialized");
console.log("Player 1: X, Player 2: O");
console.log("Player 1's turn.");
console.log("Enter: playRound(gameController, gameBoard.board, row, col); to make a move.");

