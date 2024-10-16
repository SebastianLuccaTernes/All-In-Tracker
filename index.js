const express = require('express');
const app = express();
const { readFile } = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = require('./database');
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); // For parsing application/json
app.use(express.static('public'));


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

app.post('/add-user', (request, response) => {
    const { name, username, email, age } = request.body;

    // Insert the new user into the database
    db.run(`INSERT INTO users (name, username, email, age) VALUES (?, ?, ?, ?)`, [name, username, email, age], (err) => {
        if (err) {
            return response.status(500).send('Error adding user to the database.');
        }

        // Redirect back to the home page to see the updated user list
        response.redirect('/addStats');
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
        
                    // Replace the {userTable} placeholder in the HTML with the actual table
                    const renderedHtml = html.replace('{userTable}', usersTable);
        
        response.send(renderedHtml)
    });
});

});

    // Start the server
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'));
