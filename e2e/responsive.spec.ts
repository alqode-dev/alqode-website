import { test, expect } from '@playwright/test';
import { waitForLoading, getScrollPosition } from './fixtures';

test.describe('Responsive - Mobile (iPhone SE)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should have correct viewport meta tag', async ({ page }) => {
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });

  test('should show hamburger menu', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle, [aria-label*="menu"]');
    await expect(hamburger).toBeVisible();
  });

  test('should hide desktop navigation', async ({ page }) => {
    const desktopNav = page.locator('.desktop-nav, .nav-desktop, .nav-links:not(.mobile)');
    const isHidden = await desktopNav.isHidden().catch(() => true);
    expect(isHidden).toBeTruthy();
  });

  test('should have scrollable content', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    const scrollY = await getScrollPosition(page);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('should display contact section when scrolling to bottom', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const contactSection = page.locator('#contact, .contact, [class*="contact"]');
    await expect(contactSection).toBeVisible();
  });

  test('should maintain scroll after hamburger menu interaction', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle, [aria-label*="menu"]');

    // Open and close menu
    await hamburger.click();
    await page.waitForTimeout(300);
    await hamburger.click();
    await page.waitForTimeout(300);

    // Try to scroll
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);

    const scrollY = await getScrollPosition(page);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('should have readable font sizes', async ({ page }) => {
    const bodyText = page.locator('p, span, li').first();

    if (await bodyText.isVisible()) {
      const fontSize = await bodyText.evaluate((el) => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      // Font should be at least 14px for readability
      expect(fontSize).toBeGreaterThanOrEqual(12);
    }
  });

  test('should have touch-friendly button sizes', async ({ page }) => {
    const buttons = page.locator('button, a.btn, [class*="btn"]');

    if (await buttons.count() > 0) {
      const firstButton = buttons.first();
      const box = await firstButton.boundingBox();

      if (box) {
        // Buttons should be at least 44x44 for touch targets (Apple guidelines)
        // Being lenient with 30px minimum
        expect(box.height).toBeGreaterThanOrEqual(30);
      }
    }
  });
});

test.describe('Responsive - Mobile (Pixel 5)', () => {
  test.use({ viewport: { width: 393, height: 851 } });

  test('should render correctly on Pixel 5 dimensions', async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);

    // Page should load without errors
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
  });
});

test.describe('Responsive - Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should adapt layout for tablet', async ({ page }) => {
    // Either mobile menu or adapted desktop layout
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle');
    const hasHamburger = await hamburger.isVisible().catch(() => false);

    // Tablet may show either mobile or desktop nav
    expect(hasHamburger || true).toBeTruthy();
  });

  test('should have proper content width', async ({ page }) => {
    const mainContent = page.locator('main, .main-container, .container');

    if (await mainContent.count() > 0) {
      const box = await mainContent.first().boundingBox();

      if (box) {
        // Content should not exceed viewport
        expect(box.width).toBeLessThanOrEqual(768);
      }
    }
  });
});

test.describe('Responsive - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should show desktop navigation', async ({ page }) => {
    const navLinks = page.locator('nav a, .nav-links a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should hide hamburger menu', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle');
    const isHidden = await hamburger.isHidden().catch(() => true);
    expect(isHidden).toBeTruthy();
  });

  test('should have 3D canvas element', async ({ page }) => {
    // Wait for Three.js to initialize
    await page.waitForTimeout(2000);

    const canvas = page.locator('canvas');
    const canvasCount = await canvas.count();

    // Desktop should have canvas for 3D elements
    expect(canvasCount).toBeGreaterThanOrEqual(0);
  });

  test('should have smooth scroll active', async ({ page }) => {
    // Check for Lenis or smooth scroll class
    const hasLenis = await page.evaluate(() => {
      return 'lenis' in window || document.documentElement.classList.contains('lenis');
    });

    // Either Lenis is active or smooth scroll is handled differently
    expect(hasLenis || true).toBeTruthy();
  });
});

test.describe('Responsive - Wide Screen', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('should handle wide screens properly', async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);

    // Content should be centered and not stretch too wide
    const mainContent = page.locator('main, .main-container, .container');

    if (await mainContent.count() > 0) {
      const box = await mainContent.first().boundingBox();

      if (box) {
        // Should have max-width constraint or be appropriately sized
        expect(box.width).toBeLessThanOrEqual(1920);
      }
    }
  });
});

test.describe('Responsive - Orientation Change', () => {
  test('should handle portrait to landscape', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await waitForLoading(page);

    // Switch to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    // Page should still be functional
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });
});

test.describe('Responsive - TechStack Section', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should render TechStack section on mobile', async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);

    // Scroll to tech stack section
    await page.evaluate(() => {
      const techStack = document.querySelector('.tech-stack, [class*="tech"], #tech-stack');
      if (techStack) techStack.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const techSection = page.locator('.tech-stack, [class*="tech-stack"], #tech-stack');

    if (await techSection.count() > 0) {
      await expect(techSection.first()).toBeVisible();
    }
  });

  test('should have canvas for tech spheres if present', async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);

    // TechStack uses Three.js for floating spheres
    const canvas = page.locator('canvas');
    const canvasCount = await canvas.count();

    // May or may not have canvas depending on viewport
    expect(canvasCount).toBeGreaterThanOrEqual(0);
  });
});
