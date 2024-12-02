const request = require('supertest');
const express = require('express');
const dynamicRoutes = require('../../../routes/dynamicRoutes.js').default;
const mockingoose = require('mockingoose');
const Player = require('../../../config/playerSchema.js').default;
const setupMiddleware = require('../../../middleware/setupMiddleware.js').default;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupMiddleware(app);

app.set('view engine', 'ejs');

app.use('/', dynamicRoutes);

describe('Edit a Player', () => {
    let testPlayer;
  
    beforeEach(() => {
        testPlayer = new Player({
          _id: '507f1f77bcf86cd799439011',
          playerName: 'TestPlayer2',
          games: 1,
          boughtIn: 100,
          cashedOut: 150,
        });
      
        mockingoose(Player).toReturn(testPlayer, 'findById');
    });

    afterEach(() => {
      mockingoose.resetAll();
    });
  
    it('should edit the player successfully', async () => {
      const updatedData = {
        _id: '507f1f77bcf86cd799439011',
        playerName: 'UpdatedPlayer1',
        games: 2,
        boughtIn: 200,
        cashedOut: 250,
      };
    
      // Create a proper mongoose document for mocking
      const mockPlayer = new Player(updatedData);
      
      // Mock both operations with the same data
      mockingoose(Player)
        .toReturn(mockPlayer, 'findByIdAndUpdate')
        .toReturn(mockPlayer, 'findOne');
    
      await request(app)
        .put(`/edit-player/${testPlayer._id}`)
        .send(updatedData)
        .expect(302)
        .expect('Location', '/view-player');
    
      const updatedPlayer = await Player.findById(testPlayer._id);

      console.log(updatedPlayer)
      
      expect(updatedPlayer).toBeDefined();
      expect(updatedPlayer.toObject()).toMatchObject({
        playerName: 'UpdatedPlayer1',
        games: 2,
        boughtIn: 200,
        cashedOut: 250,
      });
    });
});