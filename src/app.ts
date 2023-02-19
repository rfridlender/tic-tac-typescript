/*-------------------------------- Constants --------------------------------*/
 const winningCombos: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]
]

/*---------------------------- Variables (state) ----------------------------*/
let board: number[], turn: number, winner: boolean, tie: boolean, againstPlayer: boolean;

/*------------------------ Cached Element References ------------------------*/
const messageEl = document.querySelector<HTMLHeadingElement>('#message')!;
const boardEl = document.querySelector<HTMLElement>('#board')!;
const squareEls = document.querySelectorAll<HTMLDivElement>('.sqr')!;
const modeEls = document.querySelectorAll<HTMLButtonElement>('.mode')!;

/*----------------------------- Event Listeners -----------------------------*/
squareEls.forEach(squareEl => squareEl.addEventListener('click', handleClick));
modeEls.forEach(modeEl => modeEl.addEventListener('click', init));

/*-------------------------------- Functions --------------------------------*/
function init({ target: { id } }: MouseEvent): void {
  boardEl.classList.remove('hidden');
  againstPlayer = id === 'player' ? true : false;
  board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  turn = 1;
  winner = false;
  tie = false;
  render();
}

function render(): void {
  updateBoard();
  updateMessage();
}

function updateBoard(): void {
  board.forEach((value: number, idx: number): void => {
    squareEls[idx].textContent = value ? value === 1 ? 'X' : 'O' : '';
  });
}

function updateMessage(): void {
  messageEl.textContent = 
    winner ? `Player ${turn === 1 ? `One` : `Two`} Won!` :
    tie ? `Cat's Game!` :
    `Player ${turn === 1 ? `One` : `Two`}'s Turn!`;
}

interface MouseEvent {
  target: HTMLDivElement | HTMLButtonElement;
}

function handleClick({ target: { id } }: MouseEvent): void {
  const sqrIdx: number = parseInt(id.slice(-1));
  if (board[sqrIdx] || winner) return;
  placePiece(sqrIdx);
  checkForTie();
  checkForWinner();
  switchPlayerTurn();
  render();
  !againstPlayer && !winner && !tie && runAlgorithm();
}

function runAlgorithm():void {
  const availableMoves = findAvailableMoves();
  const sqrIdx: number = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  placePiece(sqrIdx);
  checkForTie();
  checkForWinner();
  switchPlayerTurn();
  render();
}

function findAvailableMoves(): number[] {
  const availableMoves: number[] = [];
  board.forEach((value, idx) => !value && availableMoves.push(idx));
  return availableMoves;
}

function placePiece(idx: number): void {
  board[idx] = turn;
}

function checkForTie(): void {
  tie = board.every((value): boolean => !!value);
}

function checkForWinner(): void {
  winner = winningCombos.some((winningCombo): boolean => Math.abs(winningCombo.reduce((sum, idx): number => sum += board[idx], 0)) === 3);
}

function switchPlayerTurn(): void {
  if (winner) return;
  turn *= -1;
}