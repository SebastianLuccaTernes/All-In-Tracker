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



// app.post('/add-user', (request, response) => {
//     const { name, username, email, age } = request.body;

//     // Log the received data
//     console.log('Received data:', { name, username, email, age });

//     // Insert the new user into the database
//     db.run(`INSERT INTO users (name, username, email, age) VALUES (?, ?, ?, ?)`, [name, username, email, age], (err) => {
//         if (err) {
//             console.error('Error adding user to the database:', err.message);
//             return response.status(500).send('Error adding user to the database.');
//         }

//         // Redirect back to the addStats page to see the updated user list
//         response.redirect('/add-stats');
//     });
// });


// app.post('/edit-user', (request, response) => {
//     const { 'select-user': userId, 'edit-name': newName, 'edit-username': newUsername, 'edit-email': newEmail, 'edit-age': newAge } = request.body;

//     // Log the received data
//     console.log('Received data for editing:', { userId, newName, newUsername, newEmail, newAge });

//     // Update the user in the database
//     db.run(`UPDATE users SET name = ?, username = ?, email = ?, age = ? WHERE id = ?`, [newName, newUsername, newEmail, newAge, userId], (err) => {
//         if (err) {
//             console.error('Error updating user in the database:', err.message);
//             return response.status(500).send('Error updating user in the database.');
//         }

//         // Redirect back to the addStats page to see the updated user list
//         response.redirect('/add-stats');
//     });
// });



// // Route to delete all users
// app.post('/delete-all-users', (request, response) => {
//     db.run(`DELETE FROM users`, (err) => {
//         if (err) {
//             console.error('Error deleting all users from the database:', err.message);
//             return response.status(500).send('Error deleting all users from the database.');
//         }

//         // Redirect back to the addStats page to see the updated user list
//         response.redirect('/add-stats');
//     });
// });

// // Route to delete a specific user by username
// app.post('/delete-user', (request, response) => {
//     const { username } = request.body;

//     db.run(`DELETE FROM users WHERE username = ?`, [username], (err) => {
//         if (err) {
//             console.error('Error deleting user from the database:', err.message);
//             return response.status(500).send('Error deleting user from the database.');
//         }

//         // Redirect back to the addStats page to see the updated user list
//         response.redirect('/add-stats');
//     });
// });





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

app.get('/home', (request, response) => {
    readFile('./templates/home.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('Sorry, out of order');
            return;
        }

        response.send(html)
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
    // Query the database to get all users
    db.all(`SELECT * FROM users`, [], (err, users) => {
        if (err) {
            response.status(500).send('Error retrieving data from the database');
            return console.error(err.message);
        }

        // Query the database to get all players
        db.all(`SELECT * FROM player`, [], (err, players) => {
            if (err) {
                response.status(500).send('Error retrieving data from the database');
                return console.error(err.message);
            }

            // Render the EJS template with the user and player data
            response.render('addStats', { users: users, player: players });
        });
    });
});


// app.get('/edit-user/:id', (request, response) => {
//     const userId = request.params.id;

//     // Fetch the user data from the database
//     db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
//         if (err) {
//             console.error('Error fetching user from the database:', err.message);
//             return response.status(500).send('Error fetching user from the database.');
//         }

//         if (!row) {
//             return response.status(404).send('User not found.');
//         }

//         // Load the HTML template
//         readFile('./templates/editUser.html', 'utf8', (err, html) => {
//             if (err) {
//                 response.status(500).send('Sorry, out of order');
//                 return;
//             }

//             // Replace placeholders with actual user data
//             html = html.replace('{userId}', row.id)
//                        .replace('{userName}', row.name)
//                        .replace('{userUsername}', row.username)
//                        .replace('{userEmail}', row.email)
//                        .replace('{userAge}', row.age);

//             // Send the modified HTML as the response
//             response.send(html);
//         });
//     });
// });




    // Start the server
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'));
