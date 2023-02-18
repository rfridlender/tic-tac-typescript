/*-------------------------------- Constants --------------------------------*/
 const winningCombos: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]
]

/*---------------------------- Variables (state) ----------------------------*/
let board: number[], turn: number, winner: boolean, tie: boolean;

/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll<HTMLDivElement>('.sqr')!;
const messageEl = document.querySelector<HTMLHeadingElement>('#message')!;
const resetBtnEl = document.querySelector<HTMLButtonElement>('#reset')!;

/*----------------------------- Event Listeners -----------------------------*/
squareEls.forEach(squareEl => squareEl.addEventListener('click', handleClick));
resetBtnEl.addEventListener('click', init);

/*-------------------------------- Functions --------------------------------*/
function init(): void {
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
  target: HTMLDivElement;
}

function handleClick({ target: { id } }: MouseEvent): void {
  const sqrIdx: number = parseInt(id.slice(-1));
  if (board[sqrIdx] || winner) return;
  placePiece(sqrIdx);
  checkForTie();
  checkForWinner();
  switchPlayerTurn();
  render();
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

init();