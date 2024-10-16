const express = require('express');
const app = express();
const { readFile } = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = require('./database');
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // For parsing application/json
app.use(express.static('public'));

app.post('/add-user', (request, response) => {
    const { name, username, email, age } = request.body;

    // Log the received data
    console.log('Received data:', { name, username, email, age });

    // Insert the new user into the database
    db.run(`INSERT INTO users (name, username, email, age) VALUES (?, ?, ?, ?)`, [name, username, email, age], (err) => {
        if (err) {
            console.error('Error adding user to the database:', err.message);
            return response.status(500).send('Error adding user to the database.');
        }

        // Redirect back to the addStats page to see the updated user list
        response.redirect('/addStats');
    });
});


app.post('/edit-user', (request, response) => {
    const { 'select-user': userId, 'edit-name': newName, 'edit-username': newUsername, 'edit-email': newEmail, 'edit-age': newAge } = request.body;

    // Log the received data
    console.log('Received data for editing:', { userId, newName, newUsername, newEmail, newAge });

    // Update the user in the database
    db.run(`UPDATE users SET name = ?, username = ?, email = ?, age = ? WHERE id = ?`, [newName, newUsername, newEmail, newAge, userId], (err) => {
        if (err) {
            console.error('Error updating user in the database:', err.message);
            return response.status(500).send('Error updating user in the database.');
        }

        // Redirect back to the addStats page to see the updated user list
        response.redirect('/addStats');
    });
});



// Route to delete all users
app.post('/delete-all-users', (request, response) => {
    db.run(`DELETE FROM users`, (err) => {
        if (err) {
            console.error('Error deleting all users from the database:', err.message);
            return response.status(500).send('Error deleting all users from the database.');
        }

        // Redirect back to the addStats page to see the updated user list
        response.redirect('/addStats');
    });
});

// Route to delete a specific user by username
app.post('/delete-user', (request, response) => {
    const { username } = request.body;

    db.run(`DELETE FROM users WHERE username = ?`, [username], (err) => {
        if (err) {
            console.error('Error deleting user from the database:', err.message);
            return response.status(500).send('Error deleting user from the database.');
        }

        // Redirect back to the addStats page to see the updated user list
        response.redirect('/addStats');
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


app.get('/addStats', (request, response) => {
    // Query the database to get all users
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            response.status(500).send('Error retrieving data from the database');
            return console.error(err.message);
        }

        readFile('./templates/addStats.html', 'utf8', (err, html) => {
            if (err) {
                response.status(500).send('Sorry, out of order');
                return;
            }

            // Generate the users table HTML
            let usersTable = '<table border="1"><tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th><th>Age</th><th>Created At</th></tr>';
            rows.forEach((user) => {
                usersTable += `<tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.age}</td>
                    <td>${user.created_at}</td>
                </tr>`;
            });
            usersTable += '</table>';

            // Generate the user options for the select dropdown
            let userOptions = '';
            rows.forEach((user) => {
                userOptions += `<option value="${user.id}">${user.username}</option>`;
            });

            // Replace the placeholders in the HTML with the actual content
            let renderedHtml = html.replace('{userTable}', usersTable);
            renderedHtml = renderedHtml.replace('{userOptions}', userOptions);

            response.send(renderedHtml);
        });
    });
});


app.get('/edit-user/:id', (request, response) => {
    const userId = request.params.id;

    // Fetch the user data from the database
    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
        if (err) {
            console.error('Error fetching user from the database:', err.message);
            return response.status(500).send('Error fetching user from the database.');
        }

        if (!row) {
            return response.status(404).send('User not found.');
        }

        // Load the HTML template
        readFile('./templates/editUser.html', 'utf8', (err, html) => {
            if (err) {
                response.status(500).send('Sorry, out of order');
                return;
            }

            // Replace placeholders with actual user data
            html = html.replace('{userId}', row.id)
                       .replace('{userName}', row.name)
                       .replace('{userUsername}', row.username)
                       .replace('{userEmail}', row.email)
                       .replace('{userAge}', row.age);

            // Send the modified HTML as the response
            response.send(html);
        });
    });
});




    // Start the server
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'));
