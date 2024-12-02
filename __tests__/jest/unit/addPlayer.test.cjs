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
      playerName: 'TestPlayer1',
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
    expect(testPlayer.playerName).toBe('TestPlayer1');
    expect(testPlayer.games).toBe(1);
    expect(testPlayer.boughtIn).toBe(100);
    expect(testPlayer.cashedOut).toBe(150);
  });
});