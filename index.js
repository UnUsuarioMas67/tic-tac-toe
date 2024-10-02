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

  const getPlayers = function () {
    return { playerX, playerO };
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

    const winningSquares = calculateVictory(currentPlayer);

    if (winningSquares) {
      winner = currentPlayer;
      console.log(`${currentPlayer.name} is the winner!`);
      console.log(winningSquares);
      return;
    }

    isXTurn = !isXTurn;
    console.log("Next Player: " + getNextPlayer().name);
  };

  // Takes a player as parameters and checks if said player has 3 of their marks in a row
  // If so it will return the coordinates of each square in the row
  // else returns null
  const calculateVictory = function (player) {
    // check rows
    for (let row = 0; row < 3; row++) {
      if (board[row].every((col) => col === player.getMark())) {
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
        board[0][col] == player.getMark() &&
        board[1][col] == player.getMark() &&
        board[2][col] == player.getMark()
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
      board[0][0] == player.getMark() &&
      board[1][1] == player.getMark() &&
      board[2][2] == player.getMark()
    ) {
      return [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
      ];
    }
    // top right to bottom left
    if (
      board[0][2] == player.getMark() &&
      board[1][1] == player.getMark() &&
      board[2][0] == player.getMark()
    ) {
      return [
        {row: 0, col: 2},
        {row: 1, col: 1},
        {row: 2, col: 0},
      ];
    }

    return null;
  };

  return { start, printBoard, getPlayers, getGameState, playTurn };
})();
