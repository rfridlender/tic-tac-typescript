"use strict";
/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
/*---------------------------- Variables (state) ----------------------------*/
let board, turn, winner, tie, againstPlayer, moveCount;
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
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    turn = 1;
    winner = false;
    tie = false;
    againstPlayer = id === 'player' ? true : false;
    moveCount = 0;
    render();
}
function placePiece(idx) {
    board[idx] = turn;
    moveCount++;
}
function checkForTie() {
    tie = board.every((value) => !!value);
}
function checkForWinner() {
    winner = winningCombos.some(winningCombo => Math.abs(winningCombo.reduce((sum, idx) => sum += board[idx], 0)) === 3);
}
function switchPlayerTurn() {
    if (winner)
        return;
    turn *= -1;
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
            tie ? `Cat's Gam!` :
                `Player ${turn === 1 ? `One` : `Two`}'s Turn!`;
}
/*---------------------------- Player Functions -----------------------------*/
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
/*-------------------------- Algorithm Functions ----------------------------*/
function runAlgorithm() {
    const sqrIdx = calculateMove(findAvailableMoves());
    placePiece(sqrIdx);
    checkForTie();
    checkForWinner();
    switchPlayerTurn();
    render();
}
function calculateMove(availableMoves) {
    let simBoard, simTurn, winningAlgoCombo, winningPlayerCombo, totalWinsByMove, algoMove;
    simBoard = [...board];
    simTurn = -1;
    totalWinsByMove = new Array(availableMoves.length).fill(0);
    winningAlgoCombo = winningCombos[winningCombos.findIndex(winningCombo => winningCombo.reduce((sum, idx) => sum += simBoard[idx], 0) === -2)];
    winningPlayerCombo = winningCombos[winningCombos.findIndex(winningCombo => winningCombo.reduce((sum, idx) => sum += simBoard[idx], 0) === 2)];
    if (winningAlgoCombo) {
        algoMove = winningAlgoCombo[winningAlgoCombo.findIndex(sqrIdx => !simBoard[sqrIdx])];
    }
    else if (winningPlayerCombo) {
        algoMove = winningPlayerCombo[winningPlayerCombo.findIndex(sqrIdx => !simBoard[sqrIdx])];
    }
    else {
        availableMoves.forEach((move, idx) => {
            simulateMove(simBoard, simTurn, move, idx, totalWinsByMove);
        });
        algoMove = availableMoves[totalWinsByMove.indexOf(Math.max(...totalWinsByMove))];
    }
    return algoMove;
}
function simulateMove(board, turn, move, idx, totalWinsByMove) {
    const boardInstance = [...board];
    boardInstance[move] = turn;
    turn *= -1;
    const availableMoves = [];
    boardInstance.forEach((value, idx) => !value && availableMoves.push(idx));
    if (winningCombos.some(winningCombo => winningCombo.reduce((sum, idx) => sum += boardInstance[idx], 0) === 3)) {
        totalWinsByMove[idx]--;
        return;
    }
    if (winningCombos.some(winningCombo => winningCombo.reduce((sum, idx) => sum += boardInstance[idx], 0) === -3)) {
        totalWinsByMove[idx]++;
        return;
    }
    if (!availableMoves.length) {
        return;
    }
    availableMoves.forEach(move => {
        simulateMove(boardInstance, turn, move, idx, totalWinsByMove);
    });
}
function findAvailableMoves() {
    const availableMoves = [];
    board.forEach((value, idx) => !value && availableMoves.push(idx));
    return availableMoves;
}
