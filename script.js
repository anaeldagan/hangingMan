const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const keyboardDiv = document.querySelector(".keyboard");
const guessesText = document.querySelector(".guesses-text b");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord, correctLetters = [], wrongGuessesCount = 0;
const maxGuesses = 6;

const resetGame = () => {
    correctLetters = [];
    wrongGuessesCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessesCount}.svg`;
    guessesText.innerText = `${wrongGuessesCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
};

const getRandomWord = () => {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    console.log(word);
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
};

const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? `you found the word:` : `the correct word was:`;
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'congrats!' : 'Game Over'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;

        gameModal.classList.add("show");
    }, 300);
};

const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                const letters = wordDisplay.querySelectorAll("li");
                if (letters[index]) {
                    letters[index].innerText = letter;
                    letters[index].classList.add("guessed");
                }
            }
        });
    } else {
        wrongGuessesCount++;
        hangmanImage.src = `images/hangman-${wrongGuessesCount}.svg`;
    }
    button.disabled = true;

    guessesText.innerText = `${wrongGuessesCount} / ${maxGuesses}`;
    if (wrongGuessesCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) return gameOver(true);
};

document.addEventListener("DOMContentLoaded", () => {
     getRandomWord();

     document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        console.log(`Key pressed: ${key}`);  
        if (key >= 'a' && key <= 'z') {
            const button = keyboardDiv.querySelector(`button[value="${key}"]`);
            if (button && !button.disabled) {
                console.log(`Button found for key: ${key}`); 
                initGame(button, key);
            }
        }
    });
});

for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    const letter = String.fromCharCode(i);
    button.innerText = letter;
    button.value = letter.toLowerCase();  
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, letter));
}

playAgainBtn.addEventListener("click", getRandomWord);
