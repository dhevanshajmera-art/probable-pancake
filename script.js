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
let moveInProgress = false;

let scores = { X: 0, O: 0 };

let musicAudio = document.getElementById("audio");

let soundeffects = new Audio("clicks1.mp3");

soundeffects.volume = 0.5;
soundeffects.playbackRate = 1.5;

let soundEnabled = true;
let computerTimer = null;

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


// SOUND EFFECT FUNCTION

function playClick() {

    if (!soundEnabled) return;

    soundeffects.currentTime = 0;

    let audio = soundeffects.play();

    if (audio && audio.catch) {
        audio.catch(() => {});
    }
}


// MODE SELECTION

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


// CHECK WINNER

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


// CHECK WINNER FOR MINIMAX

const checkWinnerForBoard = (board) => {

    for (let combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return board[a];

        }

    }

    return null;

};


// CHECK DRAW

const checkDraw = () => {

    return Array.from(boxes).every(
        box => box.textContent !== ""
    );

};


// DISABLE BOXES

const disableBoxes = () => {

    boxes.forEach(box => {
        box.disabled = true;
    });

    isGameActive = false;

};


// ENABLE BOXES

const enableBoxes = () => {

    boxes.forEach(box => {
        box.disabled = false;
    });

    isGameActive = true;

};


// UPDATE SCOREBOARD

const updateScoreboard = () => {

    scoreXDisplay.textContent = scores.X;
    scoreODisplay.textContent = scores.O;

    document.getElementById("wins").innerText =
        "WINS : " + scores.X;

    document.getElementById("losses").innerText =
        "LOSSES : " + scores.O;

};


// MINIMAX AI ALGORITHM

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

                let evaluation = minimax(
                    board,
                    depth + 1,
                    false
                );

                board[i] = "";

                maxEval = Math.max(maxEval, evaluation);

            }

        }

        return maxEval;

    }

    else {

        let minEval = Infinity;

        for (let i = 0; i < board.length; i++) {

            if (board[i] === "") {

                board[i] = "X";

                let evaluation = minimax(
                    board,
                    depth + 1,
                    true
                );

                board[i] = "";

                minEval = Math.min(minEval, evaluation);

            }

        }

        return minEval;

    }

};


// COMPUTER MOVE

const computerMove = () => {

    if (!isGameActive) return;

    let board = Array.from(boxes).map(
        box => box.textContent
    );

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


// CARD FLIP ANIMATION AND MOVE

const makeMove = (box, player) => {

    if (
        !isGameActive ||
        moveInProgress ||
        !box ||
        box.textContent !== ""
    ) {
        return;
    }

    moveInProgress = true;

    disableBoxes();

    box.classList.remove("animate-flip");

    void box.offsetWidth;

    box.classList.add("animate-flip");


    setTimeout(() => {

        box.textContent = player;

        handleTurnOutcome();

        moveInProgress = false;

    }, 100);


    setTimeout(() => {

        box.classList.remove("animate-flip");

    }, 600);

};


// HANDLE GAME OUTCOME

const handleTurnOutcome = () => {

    let winner = checkWin();


    // WINNER

    if (winner) {

        disableBoxes();

        statusText.textContent =
            `${winner} Wins this Round!`;

        scores[winner]++;

        updateScoreboard();

        window.location.hash = "result";

        return;

    }


    // DRAW

    if (checkDraw()) {

        statusText.textContent = "It's a Draw!";

        disableBoxes();

        window.location.hash = "result";

        return;

    }


    // CHANGE PLAYER

    currentPlayer =
        currentPlayer === "X" ? "O" : "X";

    statusText.textContent =
        `Player ${currentPlayer}'s Turn`;


    // COMPUTER TURN

    if (
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {

        disableBoxes();

        computerTimer = setTimeout(() => {

            isGameActive = true;

            computerMove();

        }, 400);

    }

    else {

        enableBoxes();

    }

};


// BOX CLICK EVENT

boxes.forEach(box => {

    box.addEventListener("click", () => {

        if (
            !isGameActive ||
            moveInProgress ||
            box.textContent !== ""
        ) {
            return;
        }

        playClick();

        makeMove(box, currentPlayer);

    });

});


// CLEAR BOARD

const clearBoard = () => {

    clearTimeout(computerTimer);

    boxes.forEach(box => {

        box.textContent = "";

        box.classList.remove("animate-flip");

    });

    currentPlayer = "X";

    moveInProgress = false;

    statusText.textContent = "Player X's Turn";

    enableBoxes();

};


// RESET GAME

const resetGame = () => {

    playClick();

    clearBoard();

    scores = {
        X: 0,
        O: 0
    };

    updateScoreboard();

};


// RESTART ROUND

const restartGame = () => {

    playClick();

    clearBoard();

};


// RESET BUTTONS

restartButton.addEventListener("click", restartGame);

resetButton.addEventListener("click", resetGame);

updateScoreboard();


// MAIN MENU

function toggleMenu() {

    playClick();

    let menu = document.getElementById("menu");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "block";

    }

}


// DISPLAY MENU

function display() {

    playClick();

    let menu = document.getElementById("display");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "block";

    }

}


// CHANGE DISPLAY

function changeDisplay(opt) {

    playClick();

    let dark = opt;

    document.body.style.backgroundColor =
        dark ? "black" : "#7af695";

    document.body.style.color =
        dark ? "white" : "black";

    document.body.style.borderColor =
        dark ? "white" : "#6f0303";


    // GAME BUTTONS

    document.querySelectorAll(".option, .reset1, .reset2")
        .forEach(button => {

            button.style.backgroundColor =
                dark ? "#1198c1" : "#cf0e0e";

            button.style.color = "white";

        });


    // GAME TITLE

    document.getElementById("gamename")
        .style.color = dark ? "white" : "#6f0303";


    // GAME CONTAINERS

    document.getElementById("opt1").style.color =
        dark ? "white" : "#6f0303";

    document.getElementById("opt1").style.borderColor =
        dark ? "white" : "#6f0303";

    document.getElementById("container").style.borderColor =
        dark ? "white" : "#6f0303";

    document.getElementById("scoreboard").style.borderColor =
        dark ? "white" : "#6f0303";


    // GAME BOXES

    boxes.forEach(box => {

        box.style.backgroundColor =
            dark ? "#0dc735" : "#cf0e0e";

    });


    // MENU ICON

    let burger = document.getElementById("burger-icon");

    if(dark == 0)
    {
        burger.src = "menu-burger.png";
    }
    if(dark == 1)
    {
        burger.src = "menu-burger-white.png";
        burger.style.height="70px";
         burger.style.width="70px";
    }


    // MENU COLOURS

    let menuElements = [
        "menu",
        "profile",
        "images",
        "sound",
        "display",
        "soundeffects"
    ];

    menuElements.forEach(id => {

        let element = document.getElementById(id);

        if (element) {

            element.style.backgroundColor =
                dark ? "black" : "#7af695";

            element.style.borderColor =
                dark ? "white" : "#6f0303";

            element.style.color =
                dark ? "white" : "#6f0303";

        }

    });


    // PROFILE IMAGE BORDER

    document.querySelectorAll(
        ".profile-image, .profile-images, #image1, #image2"
    ).forEach(image => {

        image.style.borderColor =
            dark ? "white" : "#6f0303";

    });


    // SCOREBOARD TEXT

    document.getElementById("status-text").style.color =
        dark ? "white" : "#6f0303";

    document.getElementById("score-x").style.color =
        dark ? "white" : "#6f0303";

    document.getElementById("score-o").style.color =
        dark ? "white" : "#6f0303";

    document.getElementById("score-header").style.color =
        dark ? "white" : "#6f0303";


    // CLOSE DISPLAY MENU

    document.getElementById("display").style.display = "none";

}


// MUSIC CONTROLS

function playMusic() {

    playClick();

    musicAudio.volume = 0.5;

    let playback = musicAudio.play();

    if (playback && playback.catch) {
        playback.catch(() => {});
    }

    document.getElementById("sound").style.display = "none";

}


function stopMusic() {

    playClick();

    musicAudio.pause();

    musicAudio.currentTime = 0;

    document.getElementById("sound").style.display = "none";

}


// MUSIC MENU

function music() {

    playClick();

    let menu = document.getElementById("sound");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "block";

    }

}


// SOUND EFFECTS MENU

function soundEffects() {

    playClick();

    let menu = document.getElementById("soundeffects");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "block";

    }

}


// SOUND ON

function playSound() {

    soundEnabled = true;

    soundeffects = new Audio("clicks.mp3");

    soundeffects.volume = 0.5;

    soundeffects.playbackRate = 1.5;

    playClick();

    document.getElementById("soundeffects").style.display = "none";

}


// SOUND OFF

function stopSound() {

    soundEnabled = false;

    soundeffects.pause();

    soundeffects.currentTime = 0;

    document.getElementById("soundeffects").style.display = "none";

}


// PROFILE MENU

function profile() {

    playClick();

    let menu = document.getElementById("profile");

    if (menu.style.display === "block") {

        menu.style.display = "none";

    }

    else {

        menu.style.display = "block";

    }

}


// EDIT PROFILE

function editProfile() {

    playClick();

    let menu = document.getElementById("name-input");

    let editButton = document.getElementById("edit-btn");

    let imageMenu = document.getElementById("images");


    if (menu.style.display === "block") {

        let username = menu.value.trim();

        if (username !== "") {

            document.getElementById("name").innerText =
                username;

        }

        menu.style.display = "none";

        imageMenu.style.display = "none";

        editButton.innerText = "EDIT PROFILE";

    }

    else {

        menu.value =
            document.getElementById("name").innerText;

        menu.style.display = "block";

        imageMenu.style.display = "block";

        editButton.innerText = "SAVE CHANGES";

    }

}


// CHANGE PROFILE IMAGE

function changeImage(img) {

    playClick();

    if (img == 1) {

        document.getElementById("profileimg").src =
            "hacker.png";

    }

    if (img == 2) {

        document.getElementById("profileimg").src =
            "cat.png";

    }

    if (img == 3) {

        document.getElementById("profileimg").src =
            "gamer.png";

    }

    if (img == 4) {

        document.getElementById("profileimg").src =
            "ghost.png";

    }

}

function startScreen()
{
    musicAudio.play();
    setTimeout(function () {

        document.getElementById("intro").style.display = "none";

        document.getElementById("game-screen").style.display = "block";

    }, 3000);
}
