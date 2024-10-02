const createPlayer = function (name, mark) {
  const getMark = () => mark;

  return { name, getMark };
};

const GameBoard = (function () {
  const playerX = createPlayer("Player 1", "X");
  const playerO = createPlayer("Player 2", "O");

  let board = [];
  let isXTurn = true;
  let winner = null;

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

  const getNextPlayer = () => (isXTurn ? playerX : playerO);

  const getGameState = function () {
    return { board, nextPlayer: getNextPlayer(), winner };
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

    board[row][col] = currentPlayer.getMark();
    console.log(`${currentPlayer.name} played at position [${row}, ${col}]`);

    printBoard();

    if (isWinner(currentPlayer)) {
      winner = currentPlayer;
      console.log(`${currentPlayer.name} is the winner!`);
      return;
    }

    isXTurn = !isXTurn;
    console.log("Next Player: " + getNextPlayer().name);
  };

  const isWinner = function (player) {
    // check rows
    if (board.some((row) => row.every((value) => value === player.getMark()))) {
      return true;
    }

    // check columns
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] == player.getMark() &&
        board[1][col] == player.getMark() &&
        board[2][col] == player.getMark()
      ) {
        return true;
      }
    }

    // check diagonal
    if (
      // top left to bottom right
      (board[0][0] == player.getMark() &&
        board[1][1] == player.getMark() &&
        board[2][2] == player.getMark()) ||
      // top right to bottom left
      (board[0][2] == player.getMark() &&
        board[1][1] == player.getMark() &&
        board[2][0] == player.getMark())
    ) {
      return true;
    }

    return false;
  };

  return { start, printBoard, getGameState, playTurn };
})();
