const express = require('express');
const app = express();
const { readFile } = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = require('./database');
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // For parsing application/json
app.use(express.static('public'));
app.set('view engine', 'ejs')


app.post('/add-player', (request, response) => {
    const { playerName, games, boughtIn, cashedOut } = request.body;
    const wonOrLost = cashedOut - boughtIn;

    console.log({ playerName, games, boughtIn, cashedOut, wonOrLost });

    db.run(`INSERT INTO player (name, games, boughtIn, cashedOut, WonLost) VALUES (?, ?, ?, ?, ?)`, [playerName, games, boughtIn, cashedOut, wonOrLost], (err) => {
        if (err) {
            console.error('Error adding player', err.message);
            return response.status(500).send('Error adding player to the database');
        } else {
            console.log('Successfully added new Player');
        }

        response.redirect('/add-stats');
    });
});

app.post('/add-stats', (request, response) => {
    const { 'select-player': playerId, 'edit-boughtIn': newBoughtIn, 'edit-cashedOut': newCashedOut } = request.body;

    // Log the received data
    console.log('Received data:', { playerId, newBoughtIn, newCashedOut });

    // Fetch the current games, boughtIn, and cashedOut values for the selected player
    db.get('SELECT games, boughtIn, cashedOut FROM player WHERE id = ?', [playerId], (err, row) => {
        if (err) {
            console.error('Error fetching player data', err.message);
            return response.status(500).send('Error fetching player data');
        }

        if (row) {
            const updatedGames = row.games + 1;
            const updatedBoughtIn = row.boughtIn + parseFloat(newBoughtIn);
            const updatedCashedOut = row.cashedOut + parseFloat(newCashedOut);
            const updatedWonLost = updatedCashedOut - updatedBoughtIn;

            // Update the player's stats
            db.run('UPDATE player SET games = ?, boughtIn = ?, cashedOut = ?, WonLost = ? WHERE id = ?', [updatedGames, updatedBoughtIn, updatedCashedOut, updatedWonLost, playerId], (err) => {
                if (err) {
                    console.error('Error updating player data', err.message);
                    return response.status(500).send('Error updating player data');
                }

                console.log('Player stats updated successfully');
                response.redirect('/add-stats');
            });
        } else {
            response.status(404).send('Player not found');
        }
    });
});



app.post('/delete-player', (req, res) => {
    const playerId = req.body['selected-player'];

    if (!playerId) {
        return res.status(400).send('Player ID is required');
    }

    db.run('DELETE FROM player WHERE id = ?', [playerId], function(err) {
        if (err) {
            console.error('Error deleting player:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.redirect('/add-stats'); // Redirect to the home page or any other page
    });
});




// Route to serve HTML file and display users from database
app.get('/', (request, response) => {

        // Load the HTML template
        readFile('./templates/home.html', 'utf8', (err, html) => {
            if (err) {
                response.status(500).send('Sorry, out of order');
                return;
            }

            // Send the modified HTML as the response
            response.send(html);
        });
    
});



app.get('/learning', (request, response) => {
    readFile('./templates/learning.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('Sorry, out of order');
            return;
        }
        response.send(html)
    });
});

app.get('/cheatsheet', (request, response) => {
    readFile('./templates/cheatsheet.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('Sorry, out of order');
            return;
        }
        response.send(html)
    });
});


app.get('/add-stats', (request, response) => {

    db.all(`SELECT * FROM player`, [], (err, players) => {
        if (err) {
            response.status(500).send('Error retrieving data from the database');
            return console.error(err.message);
        }

        // Render the EJS template with the user and player data
        response.render('addStats', { player: players });
    });

});




    // Start the server
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'));
