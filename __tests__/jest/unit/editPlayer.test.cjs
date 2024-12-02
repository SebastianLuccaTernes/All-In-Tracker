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

describe('Edit a Player', () => {
  let testPlayer;

  beforeEach(async () => {
    testPlayer = new Player({
      playerName: 'TestPlayer2',
      games: 1,
      boughtIn: 100,
      cashedOut: 150,
    });
    await testPlayer.save();
  });



  afterEach(async () => {
    await testPlayer.deleteOne();
  });


it('should edit the player successfully', async () => {
  const updatedData = {
    playerName: 'UpdatedPlayer',
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
  expect(updatedPlayer).not.toBeNull();
  expect(updatedPlayer.playerName).toBe('UpdatedPlayer');
  expect(updatedPlayer.games).toBe(2);
  expect(updatedPlayer.boughtIn).toBe(200);
  expect(updatedPlayer.cashedOut).toBe(250);
});
});