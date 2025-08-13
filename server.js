const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Login rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login requests per windowMs
    skipSuccessfulRequests: true
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'tic-tac-toe-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        birth_date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS game_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        games_played INTEGER DEFAULT 0,
        games_won INTEGER DEFAULT 0,
        games_lost INTEGER DEFAULT 0,
        games_tied INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS game_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        result TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        game_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Create default admin user
    const adminPassword = bcrypt.hashSync('admin', 10);
    db.run(`INSERT OR IGNORE INTO users (username, email, password, phone, birth_date) 
            VALUES (?, ?, ?, ?, ?)`, 
            ['admin', 'admin@test.com', adminPassword, '8091234567', '1990-01-01'], 
            function(err) {
                if (err && !err.message.includes('UNIQUE constraint failed')) {
                    console.error('Error creating admin user:', err);
                } else if (this.changes > 0) {
                    console.log('Admin user created successfully');
                    // Create game stats for admin user
                    db.run(`INSERT OR IGNORE INTO game_stats (user_id) VALUES (?)`, [this.lastID]);
                }
            });
}

// Validation functions
function isValidDominicanPhone(phone) {
    const phoneRegex = /^(809|829|849)[0-9]{7}$/;
    return phoneRegex.test(phone);
}

function isOver18(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        return age - 1 >= 18;
    }
    return age >= 18;
}

function isValidPassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChar;
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Routes
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'game.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/game', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Registration endpoint
app.post('/api/register', [
    body('username').isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/),
    body('email').isEmail(),
    body('password').custom(value => {
        if (!isValidPassword(value)) {
            throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters');
        }
        return true;
    }),
    body('phone').custom(value => {
        if (!isValidDominicanPhone(value)) {
            throw new Error('Phone must be a valid Dominican Republic number (809, 829, or 849)');
        }
        return true;
    }),
    body('birthDate').custom(value => {
        if (!isOver18(value)) {
            throw new Error('You must be at least 18 years old to register');
        }
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, phone, birthDate } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        db.run('INSERT INTO users (username, email, password, phone, birth_date) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, phone, birthDate], function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Registration failed' });
                }

                // Initialize game stats for new user
                db.run('INSERT INTO game_stats (user_id) VALUES (?)', [this.lastID]);

                res.json({ message: 'Registration successful', userId: this.lastID });
            });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
app.post('/api/login', loginLimiter, [
    body('username').notEmpty(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Login failed' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ message: 'Login successful', username: user.username });
    });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Get user stats
app.get('/api/stats', requireAuth, (req, res) => {
    db.get('SELECT * FROM game_stats WHERE user_id = ?', [req.session.userId], (err, stats) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to get stats' });
        }
        res.json(stats || { games_played: 0, games_won: 0, games_lost: 0, games_tied: 0 });
    });
});

// Save game result
app.post('/api/game-result', requireAuth, [
    body('result').isIn(['win', 'lose', 'tie']),
    body('difficulty').isIn(['easy', 'medium', 'hard'])
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { result, difficulty } = req.body;
    const userId = req.session.userId;

    // Save to game history
    db.run('INSERT INTO game_history (user_id, result, difficulty) VALUES (?, ?, ?)',
        [userId, result, difficulty]);

    // Update stats
    db.get('SELECT * FROM game_stats WHERE user_id = ?', [userId], (err, stats) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update stats' });
        }

        const newStats = {
            games_played: (stats?.games_played || 0) + 1,
            games_won: (stats?.games_won || 0) + (result === 'win' ? 1 : 0),
            games_lost: (stats?.games_lost || 0) + (result === 'lose' ? 1 : 0),
            games_tied: (stats?.games_tied || 0) + (result === 'tie' ? 1 : 0)
        };

        if (stats) {
            db.run('UPDATE game_stats SET games_played = ?, games_won = ?, games_lost = ?, games_tied = ? WHERE user_id = ?',
                [newStats.games_played, newStats.games_won, newStats.games_lost, newStats.games_tied, userId]);
        } else {
            db.run('INSERT INTO game_stats (user_id, games_played, games_won, games_lost, games_tied) VALUES (?, ?, ?, ?, ?)',
                [userId, newStats.games_played, newStats.games_won, newStats.games_lost, newStats.games_tied]);
        }

        res.json(newStats);
    });
});

// Check session status
app.get('/api/session', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tic Tac Toe server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});