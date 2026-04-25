const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const resetBtn = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('difficulty');

const PLAYER_X = 'X';
const PLAYER_O = 'O'; // AI
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = PLAYER_X;
let gameActive = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize Game
function initGame() {
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'occupied', 'winner');
    });
    resetBtn.addEventListener('click', resetGame);
    difficultySelect.addEventListener('change', resetGame);
}

// Handle Click
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive || currentPlayer === PLAYER_O) return;

    makeMove(index, PLAYER_X);
    
    if (gameActive) {
        currentPlayer = PLAYER_O;
        statusText.textContent = "AI is thinking...";
        statusText.style.color = "var(--o-color)";
        
        // Slight delay for realism
        setTimeout(() => {
            makeAiMove();
        }, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase(), 'occupied');
    
    checkWinOrDraw();
}

// Check Win or Draw State
function checkWinOrDraw() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winPatterns.length; i++) {
        const [a, b, c] = winPatterns[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = currentPlayer === PLAYER_X ? "You Win!" : "AI Wins!";
        statusText.style.color = currentPlayer === PLAYER_X ? "var(--x-color)" : "var(--o-color)";
        gameActive = false;
        
        // Highlight winning cells
        winningCells.forEach(index => {
            document.querySelector(`.cell[data-index="${index}"]`).classList.add('winner');
        });
        return;
    }

    if (!board.includes('')) {
        statusText.textContent = "It's a Draw!";
        statusText.style.color = "#cbd5e1";
        gameActive = false;
        return;
    }
}

// AI Move Logic
function makeAiMove() {
    const difficulty = difficultySelect.value;
    let bestMove;
    
    if (difficulty === 'hard') {
        bestMove = getBestMove();
    } else {
        bestMove = getRandomMove();
    }
    
    if (bestMove !== undefined && bestMove !== null) {
        makeMove(bestMove, PLAYER_O);
        if (gameActive) {
            currentPlayer = PLAYER_X;
            statusText.textContent = "Your Turn (X)";
            statusText.style.color = "var(--text-color)";
        }
    }
}

function getRandomMove() {
    const emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (emptyIndices.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * emptyIndices.length);
    return emptyIndices[randomIndex];
}

// --- MINIMAX ALGORITHM --- //
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = PLAYER_O;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

const scores = {
    'O': 10,
    'X': -10,
    'tie': 0
};

function checkWinnerMinimax(b) {
    for (let i = 0; i < winPatterns.length; i++) {
        const [x, y, z] = winPatterns[i];
        if (b[x] && b[x] === b[y] && b[x] === b[z]) {
            return b[x];
        }
    }
    if (!b.includes('')) return 'tie';
    return null;
}

function minimax(b, depth, isMaximizing) {
    let result = checkWinnerMinimax(b);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < b.length; i++) {
            if (b[i] === '') {
                b[i] = PLAYER_O;
                let score = minimax(b, depth + 1, false);
                b[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < b.length; i++) {
            if (b[i] === '') {
                b[i] = PLAYER_X;
                let score = minimax(b, depth + 1, true);
                b[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Reset Game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = PLAYER_X;
    gameActive = true;
    statusText.textContent = "Your Turn (X)";
    statusText.style.color = "var(--text-color)";
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell'; // reset classes
    });
}

// Start
initGame();
