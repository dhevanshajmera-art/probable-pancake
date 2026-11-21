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
var soundeffects = new Audio("clicks1.mp3");
soundeffects.volume = 0.5; // Set volume to 50%
soundeffects.playbackRate = 1.5;

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
    makeMove(boxes[bestMove], "O");
  }
};

// Helper function to handle playing a move with the flip animation
const makeMove = (box, player) => {

    box.classList.remove("animate-flip");
    void box.offsetWidth;

    box.classList.add("animate-flip");

    setTimeout(() => {
        box.textContent = player;

        // Check winner only after placing the symbol
        handleTurnOutcome();

    }, 100);

    setTimeout(() => {
        box.classList.remove("animate-flip");
    }, 200);
};

const handleTurnOutcome = () => {
  let winner = checkWin();

  if (winner) {
    disableBoxes();
    statusText.textContent = `${winner} Wins this Round!`;
    scores[winner]++;
    updateScoreboard();
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

        if (!isGameActive || box.textContent !== "") return;

        // Prevent another click while animation is running
        disableBoxes();

        makeMove(box, currentPlayer);

    });

});

const resetGame = () => {
  
  soundeffects.play();
  boxes.forEach(box => {
    box.textContent = "";
    box.classList.remove("animate-flip");
  });
  currentPlayer = "X";
  statusText.textContent = "Player X's Turn";
  scores = { X: 0, O: 0 };
  updateScoreboard();
  enableBoxes();
};

const restartGame = () => {
  
  soundeffects.play();
  boxes.forEach(box => {
    box.textContent = "";
    box.classList.remove("animate-flip");
  });
  currentPlayer = "X";
  statusText.textContent = "Player X's Turn";
  enableBoxes();
};

restartButton.addEventListener("click", restartGame);
resetButton.addEventListener("click", resetGame);

updateScoreboard();

// Function to toggle the hidden menu display
function toggleMenu() {
  soundeffects.play();
  let menu = document.getElementById("menu");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
  soundeffects.play();
}

document.getElementById("wins").innerText = " WINS : "+ scores.X;
document.getElementById("losses").innerText = " LOSSES : " + scores.O;

function display() {
soundeffects.play();
  let menu = document.getElementById("display");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
  soundeffects.play();
}
function changeDisplay(opt) {
  soundeffects.play();
  if(opt == 1) 
  {
  soundeffects.play();
  document.body.style.backgroundColor = 'black';
  document.body.style.setProperty('color', 'white');
  document.body.style.borderColor = 'white';
  document.getElementById("btn-computer").style.backgroundColor = '#1198c1';
  document.getElementById("btn-friend").style.backgroundColor = '#1198c1';
  document.getElementById("restart-button").style.backgroundColor = '#1198c1';
  document.getElementById("reset-button").style.backgroundColor = '#1198c1';
  document.getElementById("gamename").style.setProperty('color', 'white');
  document.getElementById("opt1").style.color = 'white';
  document.getElementById("opt1").style.borderColor = 'white';
  document.getElementById("container").style.borderColor = 'white';
  document.getElementById("box1").style.backgroundColor = '#0dc735';
  document.getElementById("box2").style.backgroundColor = '#0dc735';
  document.getElementById("box3").style.backgroundColor = '#0dc735';
  document.getElementById("box4").style.backgroundColor = '#0dc735';
  document.getElementById("box5").style.backgroundColor = '#0dc735';
  document.getElementById("box6").style.backgroundColor = '#0dc735';
  document.getElementById("box7").style.backgroundColor = '#0dc735';
  document.getElementById("box8").style.backgroundColor = '#0dc735';
  document.getElementById("box9").style.backgroundColor = '#0dc735';
  document.getElementById("burger-btn").src = "menu-burger-white.png";
  document.getElementById("burger-btn").height = "80";
  document.getElementById("burger-btn").width = "80";
  document.getElementById("menu").style.backgroundColor = 'black';
  document.getElementById("menu").style.borderColor = 'white';
  document.getElementById("menu").style.setProperty('color', 'white');

   document.getElementById("profile").style.backgroundColor = 'black';
  document.getElementById("profile").style.borderColor = 'white';
  document.getElementById("profile").style.setProperty('color', 'white');
  document.getElementById("profileimg").style.borderColor = '#906868';
  document.getElementById("image1").style.borderColor = '#906868';
  document.getElementById("image2").style.borderColor = '#906868';
  document.getElementById("image3").style.borderColor = '#906868';
  document.getElementById("image4").style.borderColor = '#906868';
   document.getElementById("images").style.backgroundColor = 'black';
  document.getElementById("images").style.borderColor = 'white';
  document.getElementById("images").style.setProperty('color', 'white');
  

  document.getElementById("sound").style.backgroundColor = 'black';
  document.getElementById("sound").style.borderColor = 'white';
  document.getElementById("sound").style.setProperty('color', 'white');
  document.getElementById("display").style.backgroundColor = 'black';
  document.getElementById("display").style.borderColor = 'white';
  document.getElementById("display").style.setProperty('color', 'white');
  document.getElementById("scoreboard").style.borderColor = 'white';
  document.getElementById("status-text").style.setProperty('color', 'white');
  document.getElementById("score-x").style.setProperty('color', 'white');
  document.getElementById("score-o").style.setProperty('color', 'white');
  document.getElementById("score-header").style.setProperty('color', 'white');
  document.getElementById("btn-computer").style.setProperty('color', 'white');
  document.getElementById("btn-friend").style.setProperty('color', 'white');
  document.getElementById("reset1").style.setProperty('color', 'white');
  document.getElementById("reset2").style.setProperty('color', 'white');
  document.getElementById("burger-btn").style.setProperty('color', 'white');
  document.getElementById("display").style.display = 'flex';
  document.getElementById("image1").style.borderColor = 'white';
  document.getElementById("image2").style.borderColor = 'white';
  document.getElementById("soundeffect").style.backgroundColor = 'black';
  document.getElementById("soundeffect").style.borderColor = 'white';
  display();

 
  }
  if(opt == 2)
  {
  soundeffects.play();
  document.body.style.backgroundColor = '#7af695';
  document.body.style.setProperty('color', 'black');
  document.body.style.borderColor = '#6f0303';
  document.getElementById("btn-computer").style.backgroundColor = '#6f0303';
  document.getElementById("btn-friend").style.backgroundColor = '#6f0303';
  document.getElementById("restart-button").style.backgroundColor = '#6f0303';
  document.getElementById("reset-button").style.backgroundColor = '#6f0303';
  document.getElementById("gamename").style.setProperty('color', '#6f0303');
  document.getElementById("opt1").style.color = '#6f0303';
  document.getElementById("opt1").style.borderColor = '#6f0303';
  document.getElementById("container").style.borderColor = '#6f0303';
  document.getElementById("box1").style.backgroundColor = '#cf0e0e';
  document.getElementById("box2").style.backgroundColor = '#cf0e0e';
  document.getElementById("box3").style.backgroundColor = '#cf0e0e';
  document.getElementById("box4").style.backgroundColor = '#cf0e0e';
  document.getElementById("box5").style.backgroundColor = '#cf0e0e';
  document.getElementById("box6").style.backgroundColor = '#cf0e0e';
  document.getElementById("box7").style.backgroundColor = '#cf0e0e';
  document.getElementById("box8").style.backgroundColor = '#cf0e0e';
  document.getElementById("box9").style.backgroundColor = '#cf0e0e';
  document.getElementById("burger-btn").src = "menu-burger.png";
  document.getElementById("burger-btn").height = "50";
  document.getElementById("burger-btn").width = "50";
  document.getElementById("menu").style.backgroundColor = '#7af695';
  document.getElementById("menu").style.borderColor = '#6f0303';
  document.getElementById("menu").style.setProperty('color', '#6f0303');

  document.getElementById("profile").style.backgroundColor = '#7af695';
  document.getElementById("profile").style.borderColor = '#6f0303';
  document.getElementById("profile").style.setProperty('color', '#6f0303');
  document.getElementById("image1").style.borderColor = '#6f0303';

  document.getElementById("sound").style.backgroundColor = '#7af695';
  document.getElementById("sound").style.borderColor = '#6f0303';
  document.getElementById("sound").style.setProperty('color', '#6f0303');
  document.getElementById("display").style.backgroundColor = '#7af695';
  document.getElementById("display").style.borderColor = '#6f0303';
  document.getElementById("display").style.setProperty('color', '#6f0303');
  document.getElementById("scoreboard").style.borderColor = '#6f0303';
  document.getElementById("status-text").style.setProperty('color', '#6f0303');
  document.getElementById("score-x").style.setProperty('color', '#6f0303');
  document.getElementById("score-o").style.setProperty('color', '#6f0303');
  document.getElementById("score-header").style.setProperty('color', '#6f0303');
  document.getElementById("btn-computer").style.setProperty('color', '#fff');
  document.getElementById("btn-friend").style.setProperty('color', '#fff');
  document.getElementById("reset1").style.setProperty('color', '#6f0303');
  document.getElementById("reset2").style.setProperty('color', '#6f0303');
  document.getElementById("burger-btn").style.setProperty('color', '#6f0303');
  document.getElementById("display").style.display = 'flex';
  document.getElementById("image1").style.borderColor = 'black';
  document.getElementById("image2").style.borderColor = 'black';
  document.getElementById("soundeffect").style.backgroundColor = '#7af695';
  document.getElementById("soundeffect").style.borderColor = '#6f0303';
  display();
  
  }
  
}

function playMusic() {   
  soundeffects.play();
  let audio = document.getElementById("audio");
  audio.play();
  audio.volume = 0.5; // Set volume to 50%
  soundeffects.play();
  let menu = document.getElementById("sound");
  menu.style.display = "none";
}
function stopMusic() {
  soundeffects.play();
  let audio = document.getElementById("audio");
  audio.volume = 0; // Mute the audio
  audio.currentTime = 0;
  soundeffects.play();
  let menu = document.getElementById("sound");
  menu.style.display = "none";
}

function music() {
  soundeffects.play();
  let menu = document.getElementById("sound");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
  soundeffects.play();

}




function soundEffects() {
  soundeffects.play();
  let menu = document.getElementById("soundeffect");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
  soundeffects.play();
}
function playSound() {
  soundeffects = new Audio("clicks.mp3");
  soundeffects.play();
  let menu = document.getElementById("soundeffects");
  menu.style.display = "none";
}
function stopSound() {
  soundeffects.volume= 0; // Mute the audio
  soundeffects.pause();
  soundeffects.currentTime = 0;
  let menu = document.getElementById("soundeffects");
  menu.style.display = "none";
  display();
}

function profile() {
  soundeffects.play();
  let menu = document.getElementById("profile");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
  soundeffects.play();

}

function editProfile(){
  soundeffects.play();
  
  let menu = document.getElementById("name-input");
  if (menu.style.display === "block") {
    menu.style.display = "none";
    document.getElementById("edit-btn").innerText = "EDIT PROFILE";
  } else {
    document.getElementById("edit-btn").innerText = "SAVE CHANGES";
    menu.style.display = "block";
    
  }
  let imagemenu = document.getElementById("images");
  if (imagemenu.style.display === "block") {
    imagemenu.style.display = "none";
  } else {
    imagemenu.style.display = "block";
  }
  soundeffects.play();
  let username = document.getElementById("name-input").value;
  if(username === " ")
  {
    username.innerText = "Username123";
  }
  else{
    document.getElementById("name").innerText = username;
  }
  
  
}
function changeImage(img){
  soundeffects.play();
  if(img ==1)
  {
    document.getElementById("profileimg").src = "hacker.png";
  }
  if(img ==2)
  {
    document.getElementById("profileimg").src = "cat.png";
  }
  if(img ==3)
  {
    document.getElementById("profileimg").src ="gamer.png" ;
  }
  if(img ==4)
  {
    document.getElementById("profileimg").src = "ghost.png";
  }
}
 
