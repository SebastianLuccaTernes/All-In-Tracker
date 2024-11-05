import express from 'express';
import { readFile } from 'fs';
import db from './config/database.js';
import Player from './config/playerSchema.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.use(express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
  }));

app.set('view engine', 'ejs');



//Static Page Routing

app.get('/', (request, response) => {
    readFile('./templates/home.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('Sorry, out of order');
            return;
        }
        response.send(html);
    });
});

app.get('/learning', (request, response) => {
    readFile('./templates/learning.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('Sorry, out of order');
            return;
        }
        response.send(html);
    });
});

app.get('/cheatsheet', (request, response) => {
    readFile('./templates/cheatsheet.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('Sorry, out of order');
            return;
        }
        response.send(html);
    });
});

app.get('/index.js', (req, res) => {
    res.type('.js');
    res.sendFile(path.join(__dirname, 'index.js'));
});

//Dynamic Pages

app.get('/view-player', async (request, response) => {
    try {
        const players = await Player.find({}).exec();
        response.render('view-player', {
            players: players
        });
    } catch (error) {
        console.error('Error rendering the view', error);
        response.status(500).send('Error rendering the view');
    }
});

app.get('/add-player', async (request, response) => {
    try {
        const players = await Player.find({}).exec();
        response.render('add-player', {
            players: players
        });
    } catch (error) {
        console.error('Error rendering the view', error);
        response.status(500).send('Error rendering the view');
    }
});

app.get('/add-stat', async (request, response) => {
    try {
        const players = await Player.find({}).exec();
        response.render('add-stat', {
            players: players
        });
    } catch (error) {
        console.error('Error rendering the view', error);
        response.status(500).send('Error rendering the view');
    }
});



//Post Requests

app.post('/add-player', async (request, response) => {
    try {
        const player = new Player({
            playerName: request.body.playerName,
            games: request.body.games,
            boughtIn: request.body.boughtIn,
            cashedOut: request.body.cashedOut,
            wonOrLost: request.body.cashedOut - request.body.boughtIn
        });

        await player.save();
        response.redirect('/view-player');
    } catch (error) {
        console.error('player could not be created', error);
        response.send('Error adding the player to the db');
    }
});


app.post('/add-stat', async (request, response) => {
    try {
        const { 'select-player': playerName, 'edit-boughtIn': additionalBoughtIn, 'edit-cashedOut': additionalCashedOut } = request.body;

        const difference = additionalCashedOut - additionalBoughtIn;

        await Player.findOneAndUpdate(
            { playerName: playerName },
            {
                $inc: {
                    boughtIn: additionalBoughtIn,
                    cashedOut: additionalCashedOut,
                    wonOrLost: difference
                }
            }
        );

        response.redirect('/view-player');
    } catch (error) {
        console.error('Error updating player stats', error);
        response.status(500).send('Error updating player stats');
    }
});

app.post('/add-player/delete', async (request, response) => {
    const playerName = request.body['select-player'];

    try {
      await Player.findOneAndDelete({ playerName: playerName });      
      response.redirect('/view-player')
    }catch (error) {
      console.error(error)
      response.send('Error: No Player was deleted.')
    }
  });


// Start the server
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'));