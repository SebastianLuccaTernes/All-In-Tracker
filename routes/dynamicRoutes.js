import { Router } from 'express';
import Player from '../config/playerSchema.js';

const router = Router();

router.get('/view-player', async (req, res) => {
    try {
        const players = await Player.find({}).exec();
        res.render('view-player', { players });
    } catch (error) {
        console.error('Error rendering the view', error);
        res.status(500).send('Error rendering the view');
    }
});

router.get('/view-player', async (request, response) => {
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

router.get('/add-player', async (request, response) => {
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

router.get('/add-stat', async (request, response) => {
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




router.post('/add-player', async (req, res) => {
    try {
        const player = new Player({
            playerName: req.body.playerName,
            games: req.body.games,
            boughtIn: req.body.boughtIn,
            cashedOut: req.body.cashedOut,
            wonOrLost: req.body.cashedOut - req.body.boughtIn
        });

        await player.save();
        res.redirect('/view-player');
    } catch (error) {
        console.error('Player could not be created', error);
        res.status(500).send('Error adding the player to the database');
    }
});

router.post('/add-stat', async (req, res) => {
    try {
        const playerName = req.body['select-player'];
        const additionalBoughtIn = req.body['edit-boughtIn'];
        const additionalCashedOut = req.body['edit-cashedOut'];
        const difference = additionalCashedOut - additionalBoughtIn;

        await Player.findOneAndUpdate(
            { playerName },
            {
                $inc: {
                    games: 1,
                    boughtIn: additionalBoughtIn,
                    cashedOut: additionalCashedOut,
                    wonOrLost: difference
                }
            }
        );

        res.redirect('/view-player');
    } catch (error) {
        console.error('Error updating player stats', error);
        res.status(500).send('Error updating the player stats');
    }
});

export default router;