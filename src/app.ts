/*-------------------------------- Constants --------------------------------*/
 const winningCombos: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]
];

/*---------------------------- Variables (state) ----------------------------*/
let board: number[], turn: number, winner: boolean, tie: boolean, againstPlayer: boolean;

/*------------------------ Cached Element References ------------------------*/
const titleEl = document.querySelector<HTMLHeadingElement>('#title')!;
const messageEl = document.querySelector<HTMLHeadingElement>('#message')!;
const boardEl = document.querySelector<HTMLElement>('#board')!;
const squareEls = document.querySelectorAll<HTMLDivElement>('.sqr')!;
const modesContainerEl = document.querySelector<HTMLButtonElement>('#modes-container')!;
const modeEls = document.querySelectorAll<HTMLButtonElement>('.mode')!;

/*----------------------------- Event Listeners -----------------------------*/
const addBoardEventListeners = () => squareEls.forEach(squareEl => squareEl.addEventListener('click', handleClick));
modeEls.forEach(modeEl => modeEl.addEventListener('click', init));

/*-------------------------------- Functions --------------------------------*/
function init({ target: { id } }: MouseEvent): void {
  boardEl.classList.add('hidden');
  messageEl.classList.add('hidden');
  setTimeout(() => {
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    turn = 1;
    winner = false;
    tie = false;
    againstPlayer = id === 'player' ? true : false;
    render(); 
    boardEl.classList.remove('hidden');
    addBoardEventListeners();
  }, 250);
}

function placePiece(idx: number): void {
  board[idx] = turn;
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

function render(): void {
  updateMessage();
  updateBoard();
}

function updateBoard(): void {
  if (againstPlayer) {
    board.forEach((value: number, idx: number): void => {
      squareEls[idx].innerHTML = value ? value === 1 ? 'X' : 'O' : '';
    });
  } else {
    board.forEach((value: number, idx: number): void => {
      squareEls[idx].innerHTML = value ? value === 1 ? '1' : '0' : '';
    });
  }
}

function updateMessage(): void {
  messageEl.classList.add('hidden');
  setTimeout(() => {
    if (againstPlayer) {
      messageEl.textContent = 
        winner ? `Player ${turn === 1 ? `One` : `Two`} Won!` :
        tie ? `Cat's Game!` :
        `Player ${turn === 1 ? `One` : `Two`}'s Turn!`;
    } else {
      messageEl.textContent = 
      winner ? turn === 1 ? 'Player Won': 'Solution Found' :
      tie ? `Solution Found` :
      turn === 1 ? 'Listening for input...' : 'Calculating output...'
    }
    messageEl.classList.remove('hidden');
  }, board.every(value => !value) ? 0 : 250);
}

/*---------------------------- Player Functions -----------------------------*/
function handleClick({ target: { id } }: MouseEvent): void {
  const sqrIdx: number = parseInt(id.slice(-1));
  if (board[sqrIdx] || winner) return;
  placePiece(sqrIdx);
  checkForTie();
  checkForWinner();
  switchPlayerTurn();
  render();
  if (!againstPlayer && !winner && !tie) {
    squareEls.forEach(squareEl => squareEl.removeEventListener('click', handleClick));
    setTimeout(() => {
      runAlgorithm();
      squareEls.forEach(squareEl => squareEl.addEventListener('click', handleClick));
    }, 1500);
  }
}

interface MouseEvent {
  target: HTMLDivElement | HTMLButtonElement;
}

/*-------------------------- Algorithm Functions ----------------------------*/
function runAlgorithm(): void {
  const sqrIdx: number = calculateMove(findAvailableMoves())
  placePiece(sqrIdx);
  checkForTie();
  checkForWinner();
  switchPlayerTurn();
  render();
}

function calculateMove(availableMoves: number[]): number {
  let simBoard: number[], simTurn: number, winningAlgoCombo: number[], winningPlayerCombo: number[], totalWinsByMove: number[], algoMove: number;
  simBoard = [...board];
  simTurn = -1;
  totalWinsByMove = new Array(availableMoves.length).fill(0);
  winningAlgoCombo = winningCombos[winningCombos.findIndex(winningCombo => winningCombo.reduce((sum, idx): number => sum += simBoard[idx], 0) === -2)]
  winningPlayerCombo = winningCombos[winningCombos.findIndex(winningCombo => winningCombo.reduce((sum, idx): number => sum += simBoard[idx], 0) === 2)]
  if (winningAlgoCombo) {
    algoMove = winningAlgoCombo[winningAlgoCombo.findIndex(sqrIdx => !simBoard[sqrIdx])];
  } else if (winningPlayerCombo) {
    algoMove = winningPlayerCombo[winningPlayerCombo.findIndex(sqrIdx => !simBoard[sqrIdx])];
  } else {
    availableMoves.forEach((move, idx) => {
      simulateMove(simBoard, simTurn, move, idx, totalWinsByMove);
    });
    algoMove = availableMoves[totalWinsByMove.indexOf(Math.max(...totalWinsByMove))];
  }
  return algoMove;
}

function simulateMove(board: number[], turn: number, move: number, idx: number, totalWinsByMove: number[]): void {
  const boardInstance: number[] = [...board];
  boardInstance[move] = turn;
  turn *= -1;
  const availableMoves: number[] = [];
  boardInstance.forEach((value, idx) => !value && availableMoves.push(idx));
  if (winningCombos.some(winningCombo => winningCombo.reduce((sum, idx) => sum += boardInstance[idx], 0) === -3)) {
    totalWinsByMove[idx]++;
    return;
  }
  if (winningCombos.some(winningCombo => winningCombo.reduce((sum, idx) => sum += boardInstance[idx], 0) === 3)) {
    totalWinsByMove[idx]--;
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

/*-------------------------- Opening Animations -----------------------------*/
setTimeout(() => {
  titleEl.classList.remove('hidden');
}, 1000);

setTimeout(() => {
  messageEl.classList.remove('hidden');
}, 2000);

setTimeout(() => {
  modesContainerEl.classList.remove('hidden');
}, 3000);