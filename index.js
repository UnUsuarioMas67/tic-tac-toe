const createPlayer = function (name) {
  let score = 0;
  const addScore = () => ++score;
  const getScore = () => score;
  const resetScore = () => (score = 0);

  return { name, addScore, resetScore, getScore };
};

const GameBoard = (function () {
  const playerX = createPlayer("Player 1");
  const playerO = createPlayer("Player 2");

  let board = [];
  let isXTurn = true;
  let winner = null;

  /* 
    This variable exists to tell the UI which squares 
    it should highlight when a player wins the game
  */
  let winningSquares = null;

  /* 
    This variable exists mostly to tell the UI to
    if there is a draw or not at the end of the game 
  */
  let winStatus = "none";
  /*
    "none" - The winner has not yet been determined 
    "normal" - There is a winner
    "draw" - What the name says
  */

  const resetBoard = function () {
    for (let row = 0; row < 3; row++) {
      const currRow = [];

      for (let col = 0; col < 3; col++) {
        currRow.push(null);
      }

      board.push(currRow);
    }
  };

  const start = function () {
    resetBoard();
    isXTurn = true;
    winner = null;
    winningSquares = null;
    winStatus = "none";

    console.log("\nGAME START");
    console.log("Next Player: " + getNextPlayer().name);
  };

  const printBoard = function () {
    if (board.length === 0) {
      console.log("ERROR: There is no active game to show");
      return;
    }

    board.forEach((row) => console.log(row));
  };

  const getPlayers = function () {
    return { playerX, playerO };
  };

  const getNextPlayer = () => (isXTurn ? playerX : playerO);

  const getGameState = function () {
    return {
      board,
      nextPlayer: getNextPlayer(),
      winner,
      winningSquares,
      winStatus,
    };
  };

  const playTurn = function (row, col) {
    if (board.length === 0) {
      console.log("ERROR: There is no active game to play");
      return;
    }
    if (!!winner) {
      console.log("ERROR: The game has already ended");
      return;
    }
    if (board[row] === undefined || board[row][col] === undefined) {
      console.log("ERROR: This position is invalid");
      return;
    }
    if (board[row][col] !== null) {
      console.log("ERROR: This position is already occupied");
      return;
    }

    const currentPlayer = getNextPlayer();

    board[row][col] = isXTurn ? "X" : "O";
    console.log(`${currentPlayer.name} played at position [${row}, ${col}]`);

    printBoard();

    // check if the player has won after this turn
    winningSquares = calculateVictory();

    if (winningSquares) {
      winner = currentPlayer;
      winStatus = "normal";

      console.log(`${currentPlayer.name} is the winner!`);
      console.log(winningSquares);
      return;
    }

    // if there is no winner and all squares are filled
    // the game ends as a draw
    if (
      board.every((row) => {
        return row.every((col) => col !== null);
      })
    ) {
      winStatus = "draw";

      console.log("It's a Draw");
      return;
    }

    isXTurn = !isXTurn;
    console.log("Next Player: " + getNextPlayer().name);
  };

  // Takes a player as parameters and checks if said player has 3 of their marks in a row
  // If so it will return the coordinates of each square in the row
  // else returns null
  const calculateVictory = function () {
    const currentMark = isXTurn ? "X" : "O";

    // check rows
    for (let row = 0; row < 3; row++) {
      if (board[row].every((col) => col === currentMark)) {
        return [
          { row, col: 0 },
          { row, col: 1 },
          { row, col: 2 },
        ];
      }
    }

    // check columns
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] == currentMark &&
        board[1][col] == currentMark &&
        board[2][col] == currentMark
      ) {
        return [
          { row: 0, col },
          { row: 1, col },
          { row: 2, col },
        ];
      }
    }

    // check diagonal
    // top left to bottom right
    if (
      board[0][0] == currentMark &&
      board[1][1] == currentMark &&
      board[2][2] == currentMark
    ) {
      return [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
      ];
    }
    // top right to bottom left
    if (
      board[0][2] == currentMark &&
      board[1][1] == currentMark &&
      board[2][0] == currentMark
    ) {
      return [
        { row: 0, col: 2 },
        { row: 1, col: 1 },
        { row: 2, col: 0 },
      ];
    }

    return null;
  };

  return { start, printBoard, getPlayers, getGameState, playTurn };
})();

const DisplayManager = (function (doc) {
  const xIconSource = "assets/icons/player-X.svg";
  const oIconSource = "assets/icons/player-O.svg";
  const boardElem = doc.querySelector("#gameboard");
  const squares = boardElem.querySelectorAll(".square");
  const currentTurn = doc.querySelector(".current-turn");

  const renderBoard = function (board) {
    squares.forEach((square) => {
      if (
        board[square.dataset.row] === undefined ||
        board[square.dataset.row][square.dataset.col] === undefined
      ) {
        return;
      }

      square.textContent = "";
      square.classList.remove("played");

      const s = board[square.dataset.row][square.dataset.col];

      if (s !== null) {
        square.classList.add("played");
        const mark = doc.createElement("img");
        mark.src = s == "X" ? xIconSource : oIconSource;
        square.appendChild(mark);
      }
    });
  };

  const renderCurrentTurn = function (player, isPlayerX) {
    const playerName = currentTurn.querySelector(".current-player-name");
    const playerMark = currentTurn.querySelector(".player-mark");

    playerName.textContent = player.name;
    playerName.classList.add(isPlayerX ? "player1" : "player2");
    playerName.classList.remove(!isPlayerX ? "player1" : "player2");

    playerMark.textContent = "";

    const a = doc.createTextNode("(");
    const b = doc.createTextNode(")");
    const mark = doc.createElement("img");
    mark.src = isPlayerX ? xIconSource : oIconSource;

    playerMark.appendChild(a);
    playerMark.appendChild(mark);
    playerMark.appendChild(b);
  };

  return { renderBoard, renderCurrentTurn };
})(document);
