const { test, expect } = require('@playwright/test');

test('test static views', async ({ page }) => {

  await page.goto('https://turnkey-thought-415610.ew.r.appspot.com/');
  await page.getByRole('link', { name: 'Learning' }).click();
  await page.getByRole('link', { name: 'Cheatsheet' }).click();
  await page.getByRole('link').first().click();
  await page.getByRole('link', { name: 'Learning' }).click();
  await page.getByRole('link').first().click();
  await page.getByRole('link', { name: 'Cheatsheet' }).click();
  await page.getByRole('link').first().click();
  await page.getByRole('link', { name: 'Cheatsheet' }).click();
  await page.getByRole('link', { name: 'Learning' }).click();

});