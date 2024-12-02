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

describe('Add Stats to a Player', () => {
  let testPlayer;

  beforeEach(async () => {
    testPlayer = new Player({
      playerName: 'TestPlayer3',
      games: 1,
      boughtIn: 100,
      cashedOut: 150,
    });
    await testPlayer.save();
  });

  afterEach(async () => {
    await testPlayer.deleteOne();
  });


  it('should add stats to the player successfully', async () => {
    const statsData = {
      'select-player': 'TestPlayer3',
      'edit-boughtIn': 50,
      'edit-cashedOut': 75,
    };
  
    const response = await request(app)
      .post('/add-stat')
      .send(statsData)
      .expect(302)
      .expect('Location', '/view-player');
  
    const updatedPlayer = await Player.findOne({ playerName: 'TestPlayer3' });
    expect(updatedPlayer).not.toBeNull();
    expect(updatedPlayer.games).toBe(2); // Incremented by 1
    expect(updatedPlayer.boughtIn).toBe(150); // 100 + 50
    expect(updatedPlayer.cashedOut).toBe(225); // 150 + 75
    expect(updatedPlayer.wonOrLost).toBe(75); // 225 - 150
  });
});