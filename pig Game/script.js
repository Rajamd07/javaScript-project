'use strict';

// create an score element
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');

const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');

const Cscore0El = document.getElementById('current--0');
const Cscore1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');

const btnNewEl = document.querySelector('.btn--new');
const btnRollEl = document.querySelector('.btn--roll');
const btnHoldEl = document.querySelector('.btn--hold');

// variables
let Cscore = 0;
const score = [0, 0];
let ActivePlayer = 0;
let playing = true;

const switchplayer = function () {
  Cscore = 0;
  document.querySelector(`#current--${ActivePlayer}`).textContent = Cscore;
  ActivePlayer = ActivePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

// starting value
score0El.textContent = 0;
score1El.textContent = 0;
diceEl.classList.add('hidden');

// Roll functionality
btnRollEl.addEventListener('click', function () {
  if (playing) {
    // generate a number
    const dice = Math.trunc(Math.random() * 6) + 1;

    // display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    // check dice
    if (dice !== 1) {
      // display number
      Cscore += dice;
      document.querySelector(`#current--${ActivePlayer}`).textContent = Cscore;
    } else {
      // switch player
      switchplayer();
    }
  }
});

// hold functionality
btnHoldEl.addEventListener('click', function () {
  if (playing) {
    score[ActivePlayer] += Cscore;
    document.querySelector(`#score--${ActivePlayer}`).textContent =
      score[ActivePlayer];

    if (score[ActivePlayer] >= 100) {
      playing = false;
      diceEl.classList.add('hidden');

      document
        .querySelector(`.player--${ActivePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${ActivePlayer}`)
        .classList.remove('player--active');
    } else {
      switchplayer();
    }
  }
});

// new functionality
btnNewEl.addEventListener('click', function () {
  playing = true;
  score[0] = 0;
  score[1] = 0;
  score0El.textContent = score[0];
  score1El.textContent = score[1];
  Cscore = 0;
  document.querySelector(`#current--${ActivePlayer}`).textContent = Cscore;
  document
    .querySelector(`.player--${ActivePlayer}`)
    .classList.remove('player--winner');

  ActivePlayer = 0;
  document
    .querySelector(`.player--${ActivePlayer}`)
    .classList.add('player--active');
});
