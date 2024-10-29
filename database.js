const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Define the database path in the /tmp directory
const dbPath = '/tmp/database.db';
const dbDir = path.dirname(dbPath);

// Ensure the directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create and connect to the SQLite database
let db = new sqlite3.Database(dbPath, (err) => {
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
        games INTEGER NOT NULL,
        boughtIn DOUBLE NOT NULL,
        cashedOut DOUBLE NOT NULL,
        WonLost DOUBLE
    )`, (err) => {
        if (err) {
            console.error('Error Creating Player Table', err);
        } else {
            console.log('Player Table created successfully');
        }
    });
});



// Export the database connection
module.exports = db;