"use strict";

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Globals
 const cardDeck = document.querySelector('.deck');
 let toggledCards = [];
 let moves = 0;
 let clockOff = true;
 let time = 0;
 let clockId;
 let matched = 0;

// resets all cards
 function resetCards() {
     const cards = document.querySelectorAll('.deck li');
     for (let card of cards) {
         card.className = 'card';
     }
 }
// upon completion of game: modal pops up, stops clock, shows stats
 function gameOver() {
     stopClock();
     writeModalStats();
     toggleModal();
 }

//  clicking on replay button calls: modal pop up, resets games
 function replayGame() {
     toggleModal();
     resetGame();
     
 }
 
 document.querySelector('.restart').addEventListener('click', resetGame);

 
 document.querySelector('.replay').addEventListener('click', replayGame);

//  resets stars to zero
 function resetStars() {
     let stars = 0;
     const starList = document.querySelectorAll('.stars li');
     for (let star of starList) {
         star.style.display = 'inline';
     }
 }

// resets moves to zero
 function resetMoves() {
     moves = 0;
     document.querySelector('.moves').innerHTML = moves;
 }
// resets entire game to original state
 function resetGame() {
     toggledCards = [];
     matched = 0;
     resetClockandTime();
     resetMoves();
     resetStars();
     resetCards();
     shuffleDeck();
 }

//  resets clock
function resetClockandTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

 document.querySelector('.cancel').addEventListener('click', () => {
     toggleModal();
 });

//  displays stats: time,moves,stars
 function writeModalStats() {
     const timeStat = document.querySelector('.modal_time');
     const clockTime = document.querySelector('.clock').innerHTML;
     const movesStat = document.querySelector('.modal_moves');
     const starsStat = document.querySelector('.modal_stars');
     const stars = getStars();

     timeStat.innerHTML = `Time = ${clockTime}`;
     movesStat.innerHTML = `Moves = ${moves}`;
     starsStat.innerHTML = `Stars = ${stars}`;
 }

 function getStars(){
     stars = document.querySelectorAll('.stars li');
     starCount = 0;
     for (star of stars) {
         if (star.style.display !== 'none') {
             starCount++;
         }
     }
     return starCount;
 }

//  modal popup
 function toggleModal() {
     const modal = document.querySelector('.modal_background');
     modal.classList.toggle('hide');
     
 }

 function stopClock() {
     clearInterval(clockId);
 }
 
 function startClock() {
     clockId = setInterval(function() {
         time++;
         displayTime();
        }, 1000);
 }
// clock funtionality
 function displayTime() {
     const minutes = Math.floor(time / 60);
     const seconds = time % 60;
     const clock = document.querySelector('.clock');
     clock.innerHTML = time;
     if (seconds < 10) {
        clock.innerHTML = minutes +':0'+ seconds;
     } else {
        clock.innerHTML = minutes +':'+ seconds;
     }
 }

// star rating system
 function checkScore() {
     if (moves === 10 || moves === 20)
     {
         hideStar();
     }
 }

 function hideStar() {
     const starList = document.querySelectorAll('.stars li');
     for (let star of starList){
         if (star.style.display !== 'none') {
             star.style.display = 'none';
             break;
         }
     }
 }

 function addMove() {
     moves++;
     const movesText = document.querySelector('.moves');
     movesText.innerHTML = moves;
 }
// shuffles the deck
 function shuffleDeck () {
    const cardsToShuffle = Array.from(document.querySelectorAll('.card'));
    const shuffledCards = shuffle(cardsToShuffle);
    for ( let card of shuffledCards) {
        cardDeck.appendChild(card);
    }
 }
// click event to start game
 cardDeck.addEventListener('click', event => {
     const clickTarget = event.target;
     if (isClickValid(clickTarget)) {
        if(clockOff) {
          startClock();
          clockOff = false;
        }
         toggleCard(clickTarget);  
         addToggleCard(clickTarget);
         if (toggledCards.length === 2) {
            checkForMatch(clickTarget);
            addMove();
            checkScore();
         }
        }
        const TOTAL_PAIRS = 8;
        if (matched === TOTAL_PAIRS) {
               gameOver();
        }
 });

 function isClickValid(clickTarget) {
     return (
        clickTarget.classList.contains('card') && 
        !clickTarget.classList.contains('match') && 
        toggledCards.length < 2 && 
        !toggledCards.includes(clickTarget)
     )
 };
// shows card open or closed
 function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
}

// checking for matched cards
function checkForMatch() {
    if (
        toggledCards[0].firstElementChild.className ===
        toggledCards[1].firstElementChild.className
    ) {
        toggledCards[0].classList.toggle('match')
        toggledCards[1].classList.toggle('match')
        toggledCards = [];
        matched++;

    } else {
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 1000);
    }
}