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

router.put('/edit-player/:id', async (req, res) => {
    try {
      const updatedData = {
        playerName: req.body.playerName,
        games: req.body.games,
        boughtIn: req.body.boughtIn,
        cashedOut: req.body.cashedOut,
        wonOrLost: req.body.cashedOut - req.body.boughtIn,
      };
  
      await Player.findByIdAndUpdate(req.params.id, updatedData);
      res.redirect('/view-player');
    } catch (error) {
      console.error('Error updating player', error);
      res.status(500).send('Error updating the player');
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
        const additionalBoughtIn = Number(req.body['edit-boughtIn']);
        const additionalCashedOut = Number(req.body['edit-cashedOut']);

        // Find the player and update the stats
        const updatedPlayer = await Player.findOneAndUpdate(
            { playerName },
            {
                $inc: {
                    games: 1,
                    boughtIn: additionalBoughtIn,
                    cashedOut: additionalCashedOut,
                }
            },
            { new: true }
        );

        if (!updatedPlayer) {
            return res.status(404).send('Player not found');
        }

        // Update wonOrLost based on the new totals
        updatedPlayer.wonOrLost = updatedPlayer.cashedOut - updatedPlayer.boughtIn;
        await updatedPlayer.save();

        res.redirect('/view-player');
    } catch (error) {
        console.error('Error updating player stats', error);
        res.status(500).send('Error updating the player stats');
    }
});

router.post('/add-player/delete', async (request, response) => {
    const playerName = request.body['select-player'];

    try {
      await Player.findOneAndDelete({ playerName: playerName });      
      response.redirect('/view-player')
    }catch (error) {
      console.error(error)
      response.send('Error: No Player was deleted.')
    }
  });

export default router;