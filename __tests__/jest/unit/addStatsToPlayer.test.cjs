const request = require('supertest');
const express = require('express');
const dynamicRoutes = require('../../../routes/dynamicRoutes.js').default;
const Player = require('../../../config/playerSchema.js').default;
const mockingoose = require('mockingoose');
const setupMiddleware = require('../../../middleware/setupMiddleware.js').default;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setupMiddleware(app);

app.set('view engine', 'ejs');

app.use('/', dynamicRoutes);

describe('Add Stats to a Player', () => {
  let testPlayer;

  beforeEach(() => {
    testPlayer = new Player({
      playerName: 'TestPlayer3',
      games: 1,
      boughtIn: 100,
      cashedOut: 150,
    });

    mockingoose(Player).toReturn(testPlayer, 'findOne');
    mockingoose(Player).toReturn(testPlayer, 'findOneAndUpdate');
  });

  afterEach(() => {
    mockingoose.resetAll();
  });

  it('should add stats to the player successfully', async () => {
    const statsData = {
      'select-player': 'TestPlayer3',
      'edit-boughtIn': 50,
      'edit-cashedOut': 60,
    };

    const response = await request(app)
      .post('/add-stat')
      .send(statsData);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/view-player');
  });
});