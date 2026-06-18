let boxes = document.querySelectorAll(".box");
let resetButton = document.querySelector(".reset");
let currentPlayer = "X";

// All possible winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns

  [0, 4, 8],
  [2, 4, 6]  // Diagonals
];

// Check for winner
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

// Check for draw
const checkDraw = () => {
  return Array.from(boxes).every(box => box.textContent !== "");
};

// Disable all boxes after game ends
const disableBoxes = () => {
  boxes.forEach(box => {
    box.style.pointerEvents = "none";
  });
};

// Enable boxes after reset
const enableBoxes = () => {
  boxes.forEach(box => {
    box.style.pointerEvents = "auto";
  });
};

// Add click event to each box
boxes.forEach(box => {
  box.addEventListener("click", () => {
    if (box.textContent === "") {
      box.textContent = currentPlayer;

      let winner = checkWin();

      if (winner) {
        setTimeout(() => {
          alert(`${winner} wins!`);
        }, 100);
        disableBoxes();
        return;
      }

      if (checkDraw()) {
        setTimeout(() => {
          alert("It's a draw!");
        }, 100);
        disableBoxes();
        return;
      }

      // Switch player
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  });
});

// Reset game
resetButton.addEventListener("click", () => {
  boxes.forEach(box => {
    box.textContent = "";
  });

  currentPlayer = "X";
  enableBoxes();
});