/*-------------------------------- Constants --------------------------------*/
 const winningCombos: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]
];
const permutations: number[][] = [
    [1, 2, 4, 5, 8], [0, 3, 4, 6, 7], [0, 1, 3, 4, 6], 
    [0, 1, 2, 4, 5], [0, 1], [0, 1, 2, 3, 4], 
    [0, 1, 2, 3, 4], [0, 1, 3, 4, 6], [0, 1, 2, 4, 5]
];

/*---------------------------- Variables (state) ----------------------------*/
let board: number[], turn: number, winner: boolean, tie: boolean, againstPlayer: boolean, moveCount: number;

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
  board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  turn = 1;
  winner = false;
  tie = false;
  againstPlayer = id === 'player' ? true : false;
  moveCount = 0;
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
    tie ? `Cat's Gam!` :
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

function runAlgorithm(): void {
  const sqrIdx: number = calculateMove(moveCount === 1 ? permutations[board.findIndex(value => value)] : findAvailableMoves())
  placePiece(sqrIdx);
  checkForTie();
  checkForWinner();
  switchPlayerTurn();
  render();
}

function calculateMove(availableMoves: number[]): number {
  let simBoard: number[], simTurn: number, simWinner: boolean, simTie: boolean, totalPlayerWinsByMove: number[], winningCombo: number[], algoMove: number;
  simBoard = [...board];
  simTurn = -1;
  simWinner = false;
  simTie = false;
  totalPlayerWinsByMove = new Array(availableMoves.length).fill(0);
  winningCombo = winningCombos[winningCombos.findIndex(winningCombo => Math.abs(winningCombo.reduce((sum, idx): number => sum += simBoard[idx], 0)) === 2)]
  if (winningCombo) {
    algoMove = winningCombo[winningCombo.findIndex(sqrIdx => !simBoard[sqrIdx])];
  } else {
    availableMoves.forEach((move, idx) => {
      simulateMove(simBoard, simTurn, move, idx, totalPlayerWinsByMove);
    });
    algoMove = availableMoves[totalPlayerWinsByMove.indexOf(Math.max(...totalPlayerWinsByMove))];
  }
  return algoMove;
}

function simulateMove(board: number[], turn: number, move: number, idx: number, totalWinsByMove: number[]) {
  const boardInstance: number[] = [...board];
  boardInstance[move] = turn;
  turn *= -1;
  const availableMoves: number[] = [];
  boardInstance.forEach((value, idx) => !value && availableMoves.push(idx));
  if (winningCombos.some(winningCombo => winningCombo.reduce((sum, idx): number => sum += boardInstance[idx], 0) === -3)) {
    return;
  }
  if (winningCombos.some(winningCombo => winningCombo.reduce((sum, idx): number => sum += boardInstance[idx], 0) === 3)) {
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

function findAvailableMoves(): number[] {
  const availableMoves: number[] = [];
  board.forEach((value, idx) => !value && availableMoves.push(idx));
  return availableMoves;
}

function placePiece(idx: number): void {
  board[idx] = turn;
  moveCount++;
}

function checkForTie(): void {
  tie = board.every((value): boolean => !!value);
}

function checkForWinner(): void {
  winner = winningCombos.some(winningCombo => Math.abs(winningCombo.reduce((sum, idx): number => sum += board[idx], 0)) === 3);
}

function switchPlayerTurn(): void {
  if (winner) return;
  turn *= -1;
}