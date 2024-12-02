import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import Player from '../../config/playerSchema.js';
import 'dotenv/config';


test.describe('Database Integration Tests', () => {
  test.beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  test.afterAll(async () => {
    await mongoose.connection.close();
  });

  test('test add and Delete Player', async ({ page }) => {
    await page.goto('https://turnkey-thought-415610.ew.r.appspot.com/');
    await page.getByRole('link', { name: 'View Table' }).click();
    await page.getByRole('link', { name: 'Add/Delete Player' }).click();
    await page.getByLabel('Name:').click();
    await page.getByLabel('Name:').fill('TestUser');
    await page.getByLabel('Games:').click();
    await page.getByLabel('Games:').fill('1');
    await page.getByLabel('Buy in:').click();
    await page.getByLabel('Buy in:').fill('20');
    await page.getByLabel('Cashed Out:').click();
    await page.getByLabel('Cashed Out:').fill('40');
    await page.locator('form').filter({ hasText: 'Add a New Player Name: Games' }).getByRole('button').click();

    // Verify player is added to the database
    const player = await Player.findOne({ playerName: 'TestUser' }).exec();
    expect(player).not.toBeNull();
    expect(player.games).toBe(1);
    expect(player.boughtIn).toBe(20);
    expect(player.cashedOut).toBe(40);
    expect(player.wonOrLost).toBe(20);

    await page.getByRole('link', { name: 'Add Stats' }).click();
    await page.getByLabel('Select Player:').selectOption('TestUser');
    await page.getByLabel('Bought In:').click();
    await page.getByLabel('Bought In:').fill('40');
    await page.getByLabel('Cashed Out:').click();
    await page.getByLabel('Cashed Out:').fill('20');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('link', { name: 'Add/Delete Player' }).click();
    await page.getByLabel('Select Player:').selectOption('TestUser');
    await page.locator('form').filter({ hasText: 'Delete Player Select Player:' }).getByRole('button').click();

    // Verify player is deleted from the database
    const deletedPlayer = await Player.findOne({ playerName: 'TestUser' }).exec();
    expect(deletedPlayer).toBeNull();
  });
});