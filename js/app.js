const cards = [
	'fa-umbrella',
	'fa-umbrella', 
	'fa-anchor', 
	'fa-anchor', 
	'fa-snowflake', 
	'fa-snowflake',
	'fa-heart',
	'fa-heart',
	'fa-gem',
	'fa-gem',
	'fa-bug',
	'fa-bug',
	'fa-moon',
	'fa-moon',
	'fa-music',
	'fa-music'
];
let flippedPair = [];
let totalMoves = 0;
let flippedCards = 0;
let isGameOn = false;
let timer = 0;

function toTimeString(seconds) {
  return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

function displayTimer() {
    document.getElementsByClassName('timer')[0].innerHTML=toTimeString(timer);
}

function count() {
    if(isGameOn) {
        timer += 1;
        displayTimer();
    }
}

var interval = setInterval(count, 1000);

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

// Set up the board with all the cards shuffled
function setUpBoard() {
	let shuffledCards = shuffle(cards);
	const fragment = document.createDocumentFragment();
	for (let i=0; i<shuffledCards.length; i++) {
		const newElement = document.createElement('div');
		const innerNewElement = document.createElement('div');
		newElement.classList.add('card', 'back-card');
		innerNewElement.classList.add('fas', shuffledCards[i], 'fa-fw');
		newElement.appendChild(innerNewElement);
       	fragment.appendChild(newElement);
    }
    let board = document.getElementsByClassName('board')[0];
    board.appendChild(fragment);
    return board;
}

document.addEventListener('DOMContentLoaded', function() {
	setUpBoard();
});

function flipCard(selectedCard) {
	selectedCard.classList.replace('back-card', 'front-card');
	flippedPair.push(selectedCard);
}

function flipBack(card) {
	card.classList.replace('front-card', 'back-card');
}

function restartGame() {
	let boardCards = document.getElementsByClassName('card');
	let scorePanel = document.getElementsByClassName('score')[0];
	for (let i=0; i<boardCards.length; i++) {
		boardCards[i].classList.remove('front-card');
		boardCards[i].classList.add('back-card');
	}
	if (scorePanel.classList.contains('win')) {
		scorePanel.classList.remove('win');
	}
	flippedPair = [];
	totalMoves = 0;
	flippedCards = 0;
	isGameOn = false;
	timer = 0;
	document.getElementsByClassName('timer')[0].innerHTML = '';
	showMoves();
}

function getStars(totalStars) {
	if (totalMoves <= 12) {
		totalStars.innerHTML = `<i class='fas fa-star'></i>
								<i class='fas fa-star'></i>
								<i class='fas fa-star'></i>`;
	} else if (totalMoves > 12 && totalMoves <= 18) {
		totalStars.innerHTML = `<i class='fas fa-star'></i>
								<i class='fas fa-star'></i>
								<i class='far fa-star'></i>`;
	} else if (totalMoves > 18 && totalMoves <= 25) {
		totalStars.innerHTML = `<i class='fas fa-star'></i>
								<i class='far fa-star'></i>
								<i class='far fa-star'></i>`;
	} else {
		totalStars.innerHTML = `<i class='far fa-star'></i>
								<i class='far fa-star'></i>
								<i class='far fa-star'></i>`;
	}
	return totalStars;
}

// When the game is finised displays the message with all the scores and asks to play again
function youWon() {
	let message = `You finished the game within ${toTimeString(timer)} with a total of ${totalMoves} moves.`;
	console.log(message);
	let totalStars = document.createElement('div');
	totalStars.classList.add('stars');
	getStars(totalStars);
    let board = document.getElementsByClassName('board')[0];
    let scorePanel = document.getElementsByClassName('score')[0];
    board.classList.add('win');
	board.innerHTML = `<div class='win-message'>
						   <p class='inner-win-message congrats'>Congratulations!</p></br>
						   <p class='inner-win-message'>${message}</p></br>
					   </div>`
	board.appendChild(totalStars);
	board.innerHTML += `<div class='win-message'>
						   <p class='inner-win-message'>Do you want to play again?</p>
						   <div class='play-again'>Play</div>
					   </div>`;
	scorePanel.classList.add('win');
	return board;
}

// Displays the total number of moves done by the user
function showMoves() {
	if (totalMoves === 1) {
		document.getElementsByClassName('moves')[0].textContent = `${totalMoves} Move`;
	} else {
		document.getElementsByClassName('moves')[0].textContent = `${totalMoves} Moves`;
	}
}

// Cheks if the cards match. If they do, then checks if the total flipped cards equals 
// the total number of cards and runs the function to finish the game
function checkCards() {
	let stars = document.getElementsByClassName('stars-score')[0];
	if (flippedPair[0] != false && flippedPair[0] != undefined && flippedPair[0] != null
		&& flippedPair[1] != false && flippedPair[1] != undefined && flippedPair[1] != null) {
		if (flippedPair[0].innerHTML === flippedPair[1].innerHTML) {
			flippedPair[0].classList.add('match');
			flippedPair[1].classList.add('match');
			console.log('It is a match!');
			totalMoves += 1;
			showMoves();
			getStars(stars);
			flippedCards += 2;
			if (flippedCards === cards.length) {
				setTimeout(function () {
					isGameOn = false;
		    		youWon();
				}, 2500);
			} 
		} else {
			flippedPair[0].classList.add('fail');
			flippedPair[1].classList.add('fail');
			console.log('Keep trying!');
			flipBack(flippedPair[0]);
		    flipBack(flippedPair[1]);
			totalMoves += 1;
			showMoves();
			getStars(stars);
		}
		flippedPair.pop();
		flippedPair.pop();
	}
}

// When the document detects a click this function is firstly called in order to make sure that only the right elements are passed
function getElement(element) {
	if (element.parentNode.nodeName === '#document' || element.parentNode.parentNode.nodeName === '#document') {
		return false;
	} else {
		if (element.classList.contains('card')) {
			return element;
		} else if (element.parentNode.classList.contains('card') || element.parentNode.classList.contains('inner-refresh')) {
			return element.parentNode;
		} else if (element.parentNode.parentNode.classList.contains('card') || element.parentNode.parentNode.classList.contains('inner-refresh')) {
			return element.parentNode.parentNode;
		} else {
			return false;
		}
	}
}

// Main function that detects what element was clicked and calls the appropiate function correspondingly
document.addEventListener('click', function(e) {
	element = getElement(e.target);
	let board = document.getElementsByClassName('board')[0];
	if (element != false && element != undefined && element != null) {
		if (element.classList.contains('fail') && element.classList.contains('card') && !element.classList.contains('front-card')) {
			element.classList.remove('fail');
		}
		if (flippedPair.length === 0 && element.classList.contains('card') && !element.classList.contains('front-card')) {
			if (isGameOn === false) {
				isGameOn = true;
				count();
			}
			flipCard(element);
		} else if (flippedPair.length === 1 && element.classList.contains('card') && !element.classList.contains('front-card')) {
			flipCard(element);
		    setTimeout(function () {
		    	checkCards();
			}, 2000);
		} else if (element.classList.contains('inner-refresh') || element.classList.contains('fa-sync-alt')) {
			board.innerHTML = '';
			restartGame();
	    	setUpBoard();
		}
	}
	if (e.target.classList.contains('play-again')) {
		board.classList.remove('win');
		board.innerHTML = '';
		restartGame();
	    setUpBoard();
	}
});
