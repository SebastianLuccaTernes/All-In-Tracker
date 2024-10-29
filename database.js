const sqlite3 = require('sqlite3').verbose();

// Create and connect to the SQLite database
let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the player table with the correct schema if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS player (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        games INTEGER,
        boughtIn DOUBLE,
        cashedOut DOUBLE,
        WonLost DOUBLE
    )`, (err) => {
        if (err) {
            console.error('Error Creating Player Table', err);
        } else {
            console.log('Player Table created successfully');
        }
    });
});

// Create the 'users' table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT,
        age INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating table', err);
        } else {
            console.log('Table created successfully.');
        }
    });
});

// Export the database connection
module.exports = db;
