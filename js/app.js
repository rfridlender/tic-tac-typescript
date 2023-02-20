"use strict";
/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
const permutations = [
    [1, 2, 4, 5, 8], [0, 3, 4, 6, 7], [0, 1, 3, 4, 6],
    [0, 1, 2, 4, 5], [0, 1], [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4], [0, 1, 3, 4, 6], [0, 1, 2, 4, 5]
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
    const sqrIdx = calculateMove(moveCount === 1 ? permutations[board.findIndex(value => value)] : findAvailableMoves());
    placePiece(sqrIdx);
    checkForTie();
    checkForWinner();
    switchPlayerTurn();
    render();
}
function calculateMove(availableMoves) {
    let simBoard, simTurn, simWinner, simTie, totalPlayerWinsByMove, winningCombo, algoMove;
    simBoard = [...board];
    simTurn = -1;
    simWinner = false;
    simTie = false;
    totalPlayerWinsByMove = new Array(availableMoves.length).fill(0);
    winningCombo = winningCombos[winningCombos.findIndex(winningCombo => Math.abs(winningCombo.reduce((sum, idx) => sum += simBoard[idx], 0)) === 2)];
    if (winningCombo) {
        algoMove = winningCombo[winningCombo.findIndex(sqrIdx => !simBoard[sqrIdx])];
    }
    else {
        availableMoves.forEach((move, idx) => {
            simulateMove(simBoard, simTurn, move, idx, totalPlayerWinsByMove);
        });
        algoMove = availableMoves[totalPlayerWinsByMove.indexOf(Math.max(...totalPlayerWinsByMove))];
    }
    return algoMove;
}
function simulateMove(board, turn, move, idx, totalWinsByMove) {
    const boardInstance = [...board];
    boardInstance[move] = turn;
    turn *= -1;
    const availableMoves = [];
    boardInstance.forEach((value, idx) => !value && availableMoves.push(idx));
    if (winningCombos.some(winningCombo => winningCombo.reduce((sum, idx) => sum += boardInstance[idx], 0) === -3)) {
        return;
    }
    if (winningCombos.some(winningCombo => winningCombo.reduce((sum, idx) => sum += boardInstance[idx], 0) === 3)) {
        totalWinsByMove[idx] += 1;
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
