require('dotenv').config();
const request = require('supertest');
const express = require('express');
const dynamicRoutes = require('../../../routes/dynamicRoutes.js').default;
const Player = require('../../../config/playerSchema.js').default;
const mongoose = require('mongoose');
const setupMiddleware = require('../../../middleware/setupMiddleware.js').default;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupMiddleware(app);

app.set('view engine', 'ejs');

app.use('/', dynamicRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });
  
  describe('Add a Player', () => {
    let testPlayer;
  
    beforeEach(async () => {
      testPlayer = new Player({
        playerName: 'TestPlayer4',
        games: 1,
        boughtIn: 100,
        cashedOut: 150,
      });
      await testPlayer.save();
    });
  
    afterEach(async () => {
      await testPlayer.deleteOne();
    });
  
    it('should have a testPlayer with correct properties', () => {
      expect(testPlayer).toBeTruthy();
      expect(testPlayer.playerName).toBe('TestPlayer4');
      expect(testPlayer.games).toBe(1);
      expect(testPlayer.boughtIn).toBe(100);
      expect(testPlayer.cashedOut).toBe(150);
    });
  
    // Add editPlayer test
    it('should edit the testPlayer successfully', async () => {
        const updatedData = {
            playerName: 'UpdatedPlayer2',
            games: 2,
            boughtIn: 200,
            cashedOut: 250,
          };
  
      const response = await request(app)
      .put(`/edit-player/${testPlayer._id}`)
      .send(updatedData)
      .expect(302)
      .expect('Location', '/view-player');
  
      
      const updatedPlayer = await Player.findById(testPlayer._id);
      expect(updatedPlayer.playerName).toBe('UpdatedPlayer2');
      expect(updatedPlayer.games).toBe(2);
      expect(updatedPlayer.boughtIn).toBe(200);
      expect(updatedPlayer.cashedOut).toBe(250);
    });
  
    // Add addStat test
    it('should add stats to the testPlayer successfully', async () => {
        const statsData = {
            'select-player': 'TestPlayer4',
            'edit-boughtIn': 50,
            'edit-cashedOut': 75,
          };
        
          const response = await request(app)
            .post('/add-stat')
            .send(statsData)
            .expect(302)
            .expect('Location', '/view-player');
        
          const updatedPlayer = await Player.findOne({ playerName: 'TestPlayer4' });
          expect(updatedPlayer).not.toBeNull();
          expect(updatedPlayer.games).toBe(2); // Incremented by 1
          expect(updatedPlayer.boughtIn).toBe(150); // 100 + 50
          expect(updatedPlayer.cashedOut).toBe(225); // 150 + 75
          expect(updatedPlayer.wonOrLost).toBe(75); // 225 - 150
        });
    });
