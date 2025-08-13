document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthentication();

    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = false;
    let difficulty = 'medium';
    let gameStats = {
        games_played: 0,
        games_won: 0,
        games_lost: 0,
        games_tied: 0
    };

    // DOM elements
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('gameStatus');
    const currentPlayerDisplay = document.getElementById('currentPlayer');
    const difficultySelect = document.getElementById('difficulty');
    const newGameBtn = document.getElementById('newGameBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const gameMessage = document.getElementById('gameMessage');

    // Stats elements
    const gamesPlayedEl = document.getElementById('gamesPlayed');
    const gamesWonEl = document.getElementById('gamesWon');
    const gamesLostEl = document.getElementById('gamesLost');
    const gamesTiedEl = document.getElementById('gamesTied');
    const winRateEl = document.getElementById('winRate');

    // Winning combinations
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    newGameBtn.addEventListener('click', startNewGame);
    logoutBtn.addEventListener('click', logout);
    difficultySelect.addEventListener('change', (e) => {
        difficulty = e.target.value;
    });

    // Initialize
    loadStats();

    function handleCellClick(e) {
        const cellIndex = parseInt(e.target.getAttribute('data-cell'));
        
        if (board[cellIndex] !== '' || !gameActive || currentPlayer !== 'X') {
            return;
        }

        makeMove(cellIndex, 'X');
        
        if (gameActive && currentPlayer === 'O') {
            setTimeout(() => {
                makeAIMove();
            }, 500);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        cells[index].textContent = player;
        cells[index].classList.add(player.toLowerCase());

        if (checkWinner()) {
            endGame(checkWinner());
        } else if (board.every(cell => cell !== '')) {
            endGame('tie');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateGameStatus();
        }
    }

    function makeAIMove() {
        if (!gameActive) return;

        let move;
        switch (difficulty) {
            case 'easy':
                move = getRandomMove();
                break;
            case 'medium':
                move = getMediumMove();
                break;
            case 'hard':
                move = getHardMove();
                break;
            default:
                move = getMediumMove();
        }

        if (move !== -1) {
            makeMove(move, 'O');
        }
    }

    function getRandomMove() {
        const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
    }

    function getMediumMove() {
        // 50% chance to play optimally, 50% random
        if (Math.random() < 0.5) {
            return getHardMove();
        } else {
            return getRandomMove();
        }
    }

    function getHardMove() {
        // Try to win
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                if (checkWinnerForPlayer('O')) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }

        // Try to block player win
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                if (checkWinnerForPlayer('X')) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }

        // Take center if available
        if (board[4] === '') {
            return 4;
        }

        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => board[corner] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available move
        return getRandomMove();
    }

    function checkWinner() {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    function checkWinnerForPlayer(player) {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    }

    function startNewGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'disabled');
        });

        difficulty = difficultySelect.value;
        updateGameStatus();
        hideGameMessage();
    }

    function endGame(result) {
        gameActive = false;
        cells.forEach(cell => cell.classList.add('disabled'));

        let message, resultType;
        if (result === 'X') {
            message = '🎉 You Won!';
            resultType = 'win';
            updateStats('win');
        } else if (result === 'O') {
            message = '😔 CPU Won!';
            resultType = 'lose';
            updateStats('lose');
        } else {
            message = '🤝 It\'s a Tie!';
            resultType = 'tie';
            updateStats('tie');
        }

        showGameMessage(message, resultType);
    }

    function updateGameStatus() {
        if (gameActive) {
            if (currentPlayer === 'X') {
                gameStatus.textContent = 'Your turn - Click a cell!';
            } else {
                gameStatus.textContent = 'CPU is thinking...';
            }
        }
    }

    function showGameMessage(message, type) {
        gameMessage.innerHTML = `
            <h3>${message}</h3>
            <p>Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
            <button onclick="document.getElementById('gameMessage').classList.add('hidden')">Close</button>
        `;
        gameMessage.className = `game-message ${type}`;
        gameMessage.classList.remove('hidden');
    }

    function hideGameMessage() {
        gameMessage.classList.add('hidden');
    }

    async function updateStats(result) {
        try {
            const response = await fetch('/api/game-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    result: result,
                    difficulty: difficulty
                })
            });

            if (response.ok) {
                const newStats = await response.json();
                gameStats = newStats;
                displayStats();
            }
        } catch (error) {
            console.error('Failed to update stats:', error);
        }
    }

    async function loadStats() {
        try {
            const response = await fetch('/api/stats');
            if (response.ok) {
                gameStats = await response.json();
                displayStats();
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    function displayStats() {
        gamesPlayedEl.textContent = gameStats.games_played || 0;
        gamesWonEl.textContent = gameStats.games_won || 0;
        gamesLostEl.textContent = gameStats.games_lost || 0;
        gamesTiedEl.textContent = gameStats.games_tied || 0;
        
        const winRate = gameStats.games_played > 0 
            ? Math.round((gameStats.games_won / gameStats.games_played) * 100)
            : 0;
        winRateEl.textContent = `${winRate}%`;
    }

    async function checkAuthentication() {
        try {
            const response = await fetch('/api/session');
            const result = await response.json();
            
            if (!result.loggedIn) {
                window.location.href = '/';
                return;
            }
            
            document.getElementById('username').textContent = result.username;
        } catch (error) {
            window.location.href = '/';
        }
    }

    async function logout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST'
            });
            
            if (response.ok) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    // Make hideGameMessage globally accessible
    window.hideGameMessage = hideGameMessage;
});