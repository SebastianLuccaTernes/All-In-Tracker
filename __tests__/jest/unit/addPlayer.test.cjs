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





describe('Add a Player', () => {
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
  
    // Mock the 'save' method
    mockingoose(Player).toReturn(testPlayer, 'save');
  });



it('should have a testPlayer with correct properties', async () => {
  const savedPlayer = await testPlayer.save();

  expect(savedPlayer).toBeTruthy();
  expect(savedPlayer.playerName).toBe('TestPlayer5');
  expect(savedPlayer.games).toBe(1);
  expect(savedPlayer.boughtIn).toBe(100);
  expect(savedPlayer.cashedOut).toBe(150);
    }); 
});