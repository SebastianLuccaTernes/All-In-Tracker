import { test, expect } from '@playwright/test';

test('test dynamic views', async ({ page }) => {
  await page.goto('https://turnkey-thought-415610.ew.r.appspot.com/');
  await page.getByRole('link', { name: 'View Table' }).click();
  await page.getByRole('link', { name: 'Add/Delete Player' }).click();
  await page.getByRole('link', { name: 'Player Table' }).click();
  await page.getByRole('link', { name: 'Add Stats' }).click();
  await page.getByRole('link', { name: 'Player Table' }).click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'View Table' }).click();
  await page.getByRole('link', { name: 'Add/Delete Player' }).click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'View Table' }).click();
  await page.getByRole('link', { name: 'Add Stats' }).click();
  await page.getByRole('link', { name: 'Home' }).click();
});