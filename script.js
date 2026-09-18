let boxes = document.querySelectorAll(".box");
let resetButton = document.querySelector(".reset2");
let restartButton = document.querySelector(".reset1");

let btnComputer = document.getElementById("btn-computer");
let btnFriend = document.getElementById("btn-friend");
let statusText = document.getElementById("status-text");

let scoreXDisplay = document.getElementById("score-x");
let scoreODisplay = document.getElementById("score-o");

let currentPlayer = "X";
let gameMode = "computer"; 
let isGameActive = true;
let scores = { X: 0, O: 0 };

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Mode Selection Handlers
btnComputer.addEventListener("click", () => {
  gameMode = "computer";
  btnComputer.style.fontWeight = "bold";
  btnComputer.style.border = "2px solid black";
  btnFriend.style.fontWeight = "normal";
  btnFriend.style.border = "none";
  resetGame();
});

btnFriend.addEventListener("click", () => {
  gameMode = "friend";
  btnFriend.style.fontWeight = "bold";
  btnFriend.style.border = "2px solid black";
  btnComputer.style.fontWeight = "normal";
  btnComputer.style.border = "none";
  resetGame();
});

const checkWin = () => {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      boxes[a].textContent !== "" &&
      boxes[a].textContent === boxes[b].textContent &&
      boxes[a].textContent === boxes[c].textContent
    ) {
      return boxes[a].textContent;
    }
  }
  return null;
};

const checkWinnerForBoard = (board) => {
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const checkDraw = () => {
  return Array.from(boxes).every(box => box.textContent !== "");
};

const disableBoxes = () => {
  boxes.forEach(box => box.style.pointerEvents = "none");
  isGameActive = false;
};

const enableBoxes = () => {
  boxes.forEach(box => box.style.pointerEvents = "auto");
  isGameActive = true;
};

const updateScoreboard = () => {
  scoreXDisplay.textContent = scores.X;
  scoreODisplay.textContent = scores.O;
};

// --- MINIMAX AI ALGORITHM ---
const minimax = (board, depth, isMaximizing) => {
  let winner = checkWinnerForBoard(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let evaluation = minimax(board, depth + 1, false);
        board[i] = "";
        maxEval = Math.max(maxEval, evaluation);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let evaluation = minimax(board, depth + 1, true);
        board[i] = "";
        minEval = Math.min(minEval, evaluation);
      }
    }
    return minEval;
  }
};

const computerMove = () => {
  if (!isGameActive) return;

  let board = Array.from(boxes).map(box => box.textContent);
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== undefined) {
    boxes[bestMove].textContent = "O";
    handleTurnOutcome();
  }
};

const handleTurnOutcome = () => {
  let winner = checkWin();

  if (winner) {
    statusText.textContent = `${winner} Wins this Round!`;
    scores[winner]++;
    updateScoreboard();
    disableBoxes();
    window.location.hash = "result";
    return;
  }

  if (checkDraw()) {
    statusText.textContent = "It's a Draw!";
    disableBoxes();
    window.location.hash = "result";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (gameMode === "computer" && currentPlayer === "O") {
    disableBoxes();
    setTimeout(() => {
      enableBoxes();
      computerMove();
    }, 400); 
  }
};

// Box Click Event
boxes.forEach(box => {
  box.addEventListener("click", () => {
    if (box.textContent === "" && isGameActive) {
      box.textContent = currentPlayer;
      handleTurnOutcome();
    }
  });
});

const resetGame = () => {
  boxes.forEach(box => {
    box.textContent = "";
  });
  currentPlayer = "X";
  statusText.textContent = "Player X's Turn";
  scores = { X: 0, O: 0 };
  updateScoreboard();
  enableBoxes();
};

const restartGame = () => {
  boxes.forEach(box => {
    box.textContent = "";
  });
  currentPlayer = "X";
  statusText.textContent = "Player X's Turn";
  enableBoxes();
};

restartButton.addEventListener("click", restartGame);
resetButton.addEventListener("click", resetGame);

updateScoreboard();
