"use strict";
/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
/*---------------------------- Variables (state) ----------------------------*/
let board, turn, winner, tie;
/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.querySelector('#message');
const resetBtnEl = document.querySelector('#reset');
/*----------------------------- Event Listeners -----------------------------*/
squareEls.forEach(squareEl => squareEl.addEventListener('click', handleClick));
resetBtnEl.addEventListener('click', init);
/*-------------------------------- Functions --------------------------------*/
function init() {
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
init();
