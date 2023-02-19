"use strict";
/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
/*---------------------------- Variables (state) ----------------------------*/
let board, turn, winner, tie, againstPlayer;
/*------------------------ Cached Element References ------------------------*/
const messageEl = document.querySelector('#message');
const boardEl = document.querySelector('#board');
const squareEls = document.querySelectorAll('.sqr');
const modeEls = document.querySelectorAll('.mode');
/*----------------------------- Event Listeners -----------------------------*/
squareEls.forEach(squareEl => squareEl.addEventListener('click', handleClick));
modeEls.forEach(modeEl => modeEl.addEventListener('click', init));
/*-------------------------------- Functions --------------------------------*/
function init({ target: { id } }) {
    boardEl.classList.remove('hidden');
    againstPlayer = id === 'player' ? true : false;
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    turn = 1;
    winner = false;
    tie = false;
    render();
}
function render() {
    updateBoard();
    updateMessage();
}
function updateBoard() {
    board.forEach((value, idx) => {
        squareEls[idx].textContent = value ? value === 1 ? 'X' : 'O' : '';
    });
}
function updateMessage() {
    messageEl.textContent =
        winner ? `Player ${turn === 1 ? `One` : `Two`} Won!` :
            tie ? `Cat's Game!` :
                `Player ${turn === 1 ? `One` : `Two`}'s Turn!`;
}
function handleClick({ target: { id } }) {
    const sqrIdx = parseInt(id.slice(-1));
    if (board[sqrIdx] || winner)
        return;
    placePiece(sqrIdx);
    checkForTie();
    checkForWinner();
    switchPlayerTurn();
    render();
    !againstPlayer && !winner && !tie && runAlgorithm();
}
function runAlgorithm() {
    const availableMoves = findAvailableMoves();
    const sqrIdx = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    placePiece(sqrIdx);
    checkForTie();
    checkForWinner();
    switchPlayerTurn();
    render();
}
function findAvailableMoves() {
    const availableMoves = [];
    board.forEach((value, idx) => !value && availableMoves.push(idx));
    return availableMoves;
}
function placePiece(idx) {
    board[idx] = turn;
}
function checkForTie() {
    tie = board.every((value) => !!value);
}
function checkForWinner() {
    winner = winningCombos.some((winningCombo) => Math.abs(winningCombo.reduce((sum, idx) => sum += board[idx], 0)) === 3);
}
function switchPlayerTurn() {
    if (winner)
        return;
    turn *= -1;
}
