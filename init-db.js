const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Create/connect to database
const db = new sqlite3.Database('./database.sqlite');

// Initialize database schema and admin user
db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        birth_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create game stats table
    db.run(`CREATE TABLE IF NOT EXISTS game_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        games_played INTEGER DEFAULT 0,
        games_won INTEGER DEFAULT 0,
        games_lost INTEGER DEFAULT 0,
        games_tied INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Create game history table
    db.run(`CREATE TABLE IF NOT EXISTS game_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        result TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        moves INTEGER NOT NULL,
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
                } else {
                    console.log('Admin user already exists');
                }
                
                // Close database connection
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err);
                    } else {
                        console.log('Database initialization complete');
                    }
                });
            });
});