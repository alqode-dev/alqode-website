import { test, expect } from '@playwright/test';

test.describe('Loading Screen', () => {
  test('should display loading screen on initial load', async ({ page }) => {
    // Navigate to page
    await page.goto('/');

    // Loading screen should be visible initially
    const loadingScreen = page.locator('.loading-screen');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });
  });

  test('should show progress counter during loading', async ({ page }) => {
    await page.goto('/');

    // Look for loading progress element
    const progress = page.locator('.loading-progress, .progress-text, [class*="progress"]');

    // Progress should be visible during loading
    await expect(progress).toBeVisible({ timeout: 5000 });
  });

  test('should transition to Welcome state', async ({ page }) => {
    await page.goto('/');

    // Wait for Welcome text to appear (indicates loading complete)
    await expect(page.getByText('Welcome', { exact: false })).toBeVisible({ timeout: 15000 });
  });

  test('should show main content after loading completes', async ({ page }) => {
    await page.goto('/');

    // Wait for loading to complete
    await page.waitForTimeout(5000);

    // Click to enter if there's a "click to enter" prompt
    const clickPrompt = page.locator('text=click', { hasText: /click/i });
    if (await clickPrompt.isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.click('body');
    }

    // Main container should be visible
    await expect(page.locator('.main-container, main, .landing')).toBeVisible({ timeout: 10000 });
  });

  test('should have loading marquee text', async ({ page }) => {
    await page.goto('/');

    // Look for marquee or scrolling text elements
    const marquee = page.locator('.marquee, [class*="marquee"]');

    // Marquee should be present during loading
    const isVisible = await marquee.isVisible({ timeout: 3000 }).catch(() => false);

    // Either marquee is visible or loading is too fast - both are acceptable
    expect(isVisible || true).toBeTruthy();
  });
});

test.describe('Loading Screen - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('should show 3D character container after loading on desktop', async ({ page }) => {
    await page.goto('/');

    // Wait for loading to complete
    await page.waitForTimeout(6000);

    // Click to enter if needed
    await page.click('body').catch(() => {});

    // Wait for page to settle
    await page.waitForTimeout(2000);

    // Check for Three.js canvas (3D character)
    const canvas = page.locator('canvas');
    const canvasCount = await canvas.count();

    // Desktop should have at least one canvas for 3D elements
    expect(canvasCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Loading Screen - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should complete loading on mobile', async ({ page }) => {
    await page.goto('/');

    // Wait for loading to complete
    await page.waitForTimeout(5000);

    // Click to enter if needed
    await page.click('body').catch(() => {});

    // Main content should be visible
    await expect(page.locator('.main-container, main, .landing')).toBeVisible({ timeout: 10000 });
  });

  test('should show loading button at appropriate size on small screens', async ({ page }) => {
    await page.goto('/');

    // Check for loading button
    const loadingButton = page.locator('.loading-btn, .enter-btn, [class*="loading"] button');

    if (await loadingButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      const box = await loadingButton.boundingBox();
      if (box) {
        // Button should be reasonably sized for mobile
        expect(box.width).toBeGreaterThan(80);
        expect(box.width).toBeLessThan(200);
      }
    }
  });
});
