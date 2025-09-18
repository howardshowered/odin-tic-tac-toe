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
    const gameBoard = GameBoard();
    // Player objects   
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
    const setGameOver = (status) => { gameOver = status; };

    const playRound = (row, col) => {
        if (gameOver) {
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
    }

    return {
        switchPlayer,
        getCurrentPlayer,
        incrementRound,
        getRound,
        isGameOver,
        playRound,
        setGameOver,
        getBoard: gameBoard.getBoard
    };
}

function ScreenController() {
    const gameController = GameController();
    const gameBoard = gameController.getBoard();
    const boardElement = document.querySelector('.board');
    const turnElement = document.querySelector('.turn');
    const currentPlayer = gameController.getCurrentPlayer();
    const resetButton = document.querySelector('.reset');

    const renderBoard = () => {
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

    function playRound(row, col) {
        if (gameController.isGameOver()) {
            console.log("Game is already over.");
            return;
        }

        if (row < 0 || row >= 3 || col < 0 || col >= 3) {
            console.log("Invalid move. Row and Column must be between 0 and 2.");
            return;
        }

        const cell = gameBoard[row][col];
        if (!cell.isEmpty()) {
            console.log("Cell is already occupied. Choose another cell.");
            return;
        }

        const currentPlayer = gameController.getCurrentPlayer();
        cell.setValue(currentPlayer.symbol);
        renderBoard();
        gameController.incrementRound();

        const checkWin = (symbol) => {
            // Check rows and columns
            for (let i = 0; i < 3; i++) {
                if (gameBoard[i][0].getValue() === symbol &&
                    gameBoard[i][1].getValue() === symbol && 
                    gameBoard[i][2].getValue() === symbol) {
                    return true;
                }
                if (gameBoard[0][i].getValue() === symbol &&
                    gameBoard[1][i].getValue() === symbol && 
                    gameBoard[2][i].getValue() === symbol) {
                    return true;
                }
            }
            // Check diagonals
            if (gameBoard[0][0].getValue() === symbol && 
                gameBoard[1][1].getValue() === symbol && 
                gameBoard[2][2].getValue() === symbol) {
                return true;
            }
            if (gameBoard[0][2].getValue() === symbol && 
                gameBoard[1][1].getValue() === symbol &&
                gameBoard[2][0].getValue() === symbol) {
                return true;
            }
            return false;
        };

        // Check for win or draw conditions here (not implemented in this snippet)
        if(gameController.getRound() >= 5) {
            // Check rows, columns, and diagonals for a win

            if (checkWin(currentPlayer.symbol)) {
                renderBoard();
                console.log(`${currentPlayer.name} wins!`);
                gameController.setGameOver(true);
                turnElement.textContent = `${currentPlayer.name} wins!`;
            } else if (gameController.getRound() === gameController.maxRounds) {
                console.log("It's a draw!");
                gameController.setGameOver(true);
                turnElement.textContent = "It's a draw!";
            }
        }

        console.log(`Round ${gameController.getRound()}: ${currentPlayer.name} placed ${currentPlayer.symbol} at (${row}, ${col})`);
        gameController.switchPlayer();
    }

    function clickHandlerBoard(e) {
        if(gameController.isGameOver()) {
            return;
        }
        const selectedColumn = e.target.dataset.col;
        const selectedRow = e.target.dataset.row;
        if (selectedColumn === undefined || selectedRow === undefined) {
            return;
        }
        playRound( selectedRow, selectedColumn);
        // renderBoard();
        if (!gameController.isGameOver()) {
            updateTurn(gameController.getCurrentPlayer());
        } 
    }

    function resetButtonHandler() {
        gameController.setGameOver(false);
        gameController.round = 0;
        gameBoard.forEach(row => row.forEach(cell => cell.reset()));
        renderBoard();
        updateTurn(gameController.getCurrentPlayer());
        console.log("Game reset. Player 1's turn.");
    }

    resetButton.addEventListener('click', resetButtonHandler);

    boardElement.addEventListener('click', clickHandlerBoard);

    const updateTurn = () => {
        turnElement.textContent = `It's ${currentPlayer.name}'s turn.`;
    };


    renderBoard();
    updateTurn();
    return { renderBoard, updateTurn };
}
// console.log("Tic Tac Toe Game Initialized");
// console.log("Player 1: X, Player 2: O");
// const gameBoard = GameBoard();
// const gameController = GameController("Alice", "Bob");
const screenController = ScreenController();
    
console.log("Tic Tac Toe Game Initialized");
console.log("Player 1: X, Player 2: O");
console.log("Player 1's turn.");
console.log("Enter: playRound(gameController, gameBoard.board, row, col); to make a move.");

