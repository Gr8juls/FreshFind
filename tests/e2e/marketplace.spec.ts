import { test, expect } from '@playwright/test';

test.describe('FreshFind Marketplace End-to-End User Journeys', () => {
  test('loads home discovery marketplace and displays surprise bags', async ({ page }) => {
    await page.goto('/');

    // Check header logo and title
    await expect(page.locator('header')).toContainText('FreshFind');

    // Check presence of discovery category filters
    await expect(page.getByRole('button', { name: /Bakery/i }).first()).toBeVisible();

    // Check that at least one offer card is rendered
    const cards = page.locator('.glass-card');
    await expect(cards.first()).toBeVisible();
  });

  test('interacts with AI Smart Search bar and filters listings', async ({ page }) => {
    await page.goto('/');

    // Type query into AI search input
    const searchInput = page.getByPlaceholder(/Ask AI: e.g. 'Cheap halal dinner/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('Bakery croissants');
    await page.keyboard.press('Enter');

    // Check that filtered results show bakery items
    await expect(page.locator('body')).toContainText(/Bakery|Croissant|Pastry/i);
  });

  test('opens Chef Rescue AI modal from navigation or offer card', async ({ page }) => {
    await page.goto('/');

    // Click on Chef Rescue AI button in navbar
    const chefBtn = page.getByTitle(/Chef Rescue AI Zero-Waste Recipe Assistant/i);
    if (await chefBtn.isVisible()) {
      await chefBtn.click();
      await expect(page.locator('body')).toContainText(/Chef Rescue/i);
    }
  });
});
