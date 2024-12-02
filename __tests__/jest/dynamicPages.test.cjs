require('dotenv').config();
const request = require('supertest');
const express = require('express');
const dynamicRoutes = require('../../routes/dynamicRoutes.js').default;
const Player = require('../../config/playerSchema.js').default;
const mongoose = require('mongoose');
const { default: setupMiddleware } = require('../../middleware/setupMiddleware.js');

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

describe('Dynamic Routes', () => {
  let testPlayer;

  beforeEach(async () => {
  
    testPlayer = new Player({
      playerName: 'TestPlayer',
      games: 1,
      boughtIn: 100,
      cashedOut: 150,
    });
    await testPlayer.save();
  });

  afterEach(async () => {
    await testPlayer.deleteOne();
  });

  it('should render the view-player page', async () => {
    const res = await request(app).get('/view-player');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('TestPlayer');
  });

  it('should render the add-player page to add a player', async () => {
    const res = await request(app).get('/add-player');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Add/Delete Player');
    });

    
});