import { test, expect } from '@playwright/test';

for (const width of [360, 390, 430, 768, 1024, 1280, 1536]) {
  test(`shell has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(hasOverflow).toBe(false);
  });
}
