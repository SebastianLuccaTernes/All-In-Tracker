require('dotenv').config();
const request = require('supertest');
const express = require('express');
const dynamicRoutes = require('../../../routes/dynamicRoutes.js').default;
const mockingoose = require('mockingoose');
const Player = require('../../../config/playerSchema.js').default;
const mongoose = require('mongoose');
const setupMiddleware = require('../../../middleware/setupMiddleware.js').default;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupMiddleware(app);

app.set('view engine', 'ejs');

app.use('/', dynamicRoutes);




describe('Delete a Player', () => {
    let testPlayer;
   
    afterEach(() => {
      mockingoose.resetAll();
    });
  
    beforeEach(() => {
      testPlayer = new Player({
        playerName: 'TestPlayer5',
        games: 1,
        boughtIn: 100,
        cashedOut: 150,
      });
    
      mockingoose(Player).toReturn(testPlayer, 'findOne');
      mockingoose(Player).toReturn(testPlayer, 'findOneAndDelete');
    });
  
    it('should delete a player successfully', async () => {
      const response = await request(app)
        .post('/add-player/delete')
        .send({ 'select-player': 'TestPlayer5' })
        .expect(302)
        .expect('Location', '/view-player');
  
      mockingoose(Player).toReturn(null, 'findOne');
      const deletedPlayer = await Player.findOne({ playerName: 'TestPlayer5' });
      expect(deletedPlayer).toBeNull();
    });
  
    it('should redirect after attempting to delete non-existent player', async () => {
      mockingoose(Player).toReturn(null, 'findOneAndDelete');
  
      const response = await request(app)
        .post('/add-player/delete')
        .send({ 'select-player': 'NonExistentPlayer' })
        .expect(302)
        .expect('Location', '/view-player');
    });
});