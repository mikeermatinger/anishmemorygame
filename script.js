const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;


// Items array
const items = [
    {name: "bear", clan: "makwa", image: "bear.png", audio: "makwa.mp3"},
    {name: "deer", clan: "waawaashkeshi", image: "deer.png", audio: "waawaashkeshi.mp3"},
    {name: "eagle", clan: "mgizi", image: "eagle.png", audio: "mgizi.mp3"},
    {name: "fish", clan: "giigoonh", image: "fish.png", audio: "giigoonh.mp3"},
    {name: "wolf", clan: "ma'iingan", image: "wolf.png", audio: "maiingan.mp3"},
    {name: "bird", clan: "benaishii", image: "bird.png", audio: "benaishii.mp3"},
    {name: "turtle", clan: "mikinaak", image: "turtle.jpeg", audio: "mikinaak.mp3"},
    {name: "beaver", clan: "amik", image: "beaver.png", audio: "amik.mp3"},
    {name: "crane", clan: "aajiijak", image: "crane.png", audio: "aajiijak.mp3"},
    {name: "loon", clan: "maang", image: "loon.png", audio: "maang.mp3"},
    {name: "marten", clan: "waabizheshi", image: "marten.png", audio: "waabizheshi.mp3"},
    {name: "heron", clan: "shagi", image: "heron.png", audio: "shagi.mp3"},
    {name: "hawk", clan: "memeskniniisi", image: "hawk.png", audio: "memeskniniisi.mp3"},
];

const medicinewheel = [
    {name: "medicinewheel", image: "medicinewheelsmaller.png"},
];


// Initial Time
let seconds = 0,
    minutes = 0;


// Initial Moves & Win Count
let movesCount = 0,
    winCount = 0;


// For Timer
const timeGenerator = () => {
    seconds += 1;
    // Minutes logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    // Format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// Calculate moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Pick random objects from item array
const generateRandom = (size = 4) => {
    // Temporary array
    let tempArray = [...items];
    // Initializes cardValues array
    let cardValues = [];
    // Size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    // Random object selection
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        // Once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    // Simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        /*
            Create Cards
            before => front side (contains question mark)
            after => back side (contains actual image)
            data-card-value is a custom attribute which stores the names of the cards to match later
        */
        //audio = new Audio(cardValues[i].audio);
        gameContainer.innerHTML += `
            <div class="card-container" data-card-value="${cardValues[i].name}" data-audio-value="${cardValues[i].audio}">
                <div class="card-before"><img src="${medicinewheel[0].image}" class="image"></div>
                <div class="card card-after"><p class="card-title m3">${cardValues[i].clan}</p><img src="${cardValues[i].image}" class="image"><p class="card-text m3">${cardValues[i].name}</p></div>
            </div>
            `;
    }
    // Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    // Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            // If selected card is not matched yet, then only run (ie only matched card when clicked, would be ignored)
            // BUG FIX LINE 112 ADDED: && !card.classList.contains("flipped")
            if (!card.classList.contains("matched") && !card.classList.contains("flipped")) {
                // Flip the clicked card
                card.classList.add("flipped");
                // If it is the firstcard (!firstCard because first card will initially false)
                if (!firstCard) {
                    // So current card will become firstCard
                    firstCard = card;
                    // Current cards value becomes firstCardValue
                    firstCardValue = card.getAttribute("data-card-value");
                    // Can I add play function here??? b/c firstCardValue has just been assigned a data-card-value
                    let cardaudio = card.getAttribute("data-audio-value");
                    let sound = new Audio(cardaudio);
                    sound.play();
                }
                else {
                    // Increment moves since user selected second card
                    movesCounter();
                    // secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    let cardaudio = card.getAttribute("data-audio-value");
                    let sound = new Audio(cardaudio);
                    sound.play();

                    // Can/Must I add play function here also per line 123 above??? b/c line 123 above and secondCardValue has just been assigned a data-card-value
                    if (firstCardValue == secondCardValue) {
                        // If both cards match add matched class so these cards would be ignored next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        // Set firstCard to falsesince next card will be first now
                        firstCard = false;
                        // winCount increment as user found a correct match
                        winCount += 1;
                        // Check if winCount == half of cardValues
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won</h2> <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    }
                    else {
                        // If the cards do not match
                        // Flip the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 1800);
                    }
                }
            }
        });
    });
};

// function play() {
    // var cardaudio = card.getAttribute('data-card-value')
    // audio = cardaudio.audio
    // audio.play();
//};

// Start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    // Controls and button visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    // Start timer
    interval = setInterval(timeGenerator, 1000);
    // initial moves
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});

// Stop game
stopButton.addEventListener("click", (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
    })
);

// Initialize values and function calls
const initializer = () => {
    result.innerText = "";
    wincount = 0;
    let cardValues = generateRandom();
    console.log(cardValues, 'data-card-value');
    matrixGenerator(cardValues);
};