import { Page, expect } from '@playwright/test';

/**
 * Reusable test fixtures for Alqode website E2E tests
 */

/**
 * Wait for the loading screen to complete and main content to be visible
 */
export async function waitForLoading(page: Page): Promise<void> {
  // Wait for loading screen to appear
  const loadingScreen = page.locator('.loading-screen');

  // Wait for loading to complete - either screen disappears or shows "Welcome"
  await expect(async () => {
    const isHidden = await loadingScreen.isHidden().catch(() => true);
    const hasWelcome = await page.locator('text=Welcome').isVisible().catch(() => false);
    expect(isHidden || hasWelcome).toBeTruthy();
  }).toPass({ timeout: 15000 });

  // Wait for main content to be visible
  await expect(page.locator('.main-container, .landing, [class*="landing"]')).toBeVisible({ timeout: 10000 });
}

/**
 * Scroll to a specific section by ID or selector
 */
export async function scrollToSection(page: Page, sectionId: string): Promise<void> {
  const selector = sectionId.startsWith('.') || sectionId.startsWith('#')
    ? sectionId
    : `#${sectionId}`;

  await page.locator(selector).scrollIntoViewIfNeeded();
  // Wait for scroll animation to settle
  await page.waitForTimeout(500);
}

/**
 * Open the mobile hamburger menu
 */
export async function openMobileMenu(page: Page): Promise<void> {
  const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle, [aria-label*="menu"]');
  await hamburger.click();
  // Wait for menu animation
  await page.waitForTimeout(300);
}

/**
 * Close the mobile hamburger menu
 */
export async function closeMobileMenu(page: Page): Promise<void> {
  // Try clicking the close button first, then the hamburger
  const closeButton = page.locator('.mobile-menu-close, .hamburger-menu.open, [aria-label*="close"]');
  const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle');

  if (await closeButton.isVisible()) {
    await closeButton.click();
  } else if (await hamburger.isVisible()) {
    await hamburger.click();
  }

  // Wait for menu close animation
  await page.waitForTimeout(300);
}

/**
 * Check if the page is in mobile viewport
 */
export async function isMobileViewport(page: Page): Promise<boolean> {
  const viewport = page.viewportSize();
  return viewport ? viewport.width <= 1024 : false;
}

/**
 * Wait for GSAP/Lenis animations to settle
 */
export async function waitForAnimations(page: Page): Promise<void> {
  await page.waitForTimeout(1000);
}

/**
 * Click a navigation link and wait for scroll
 */
export async function clickNavLink(page: Page, linkText: string): Promise<void> {
  await page.getByRole('link', { name: linkText }).click();
  await waitForAnimations(page);
}

/**
 * Get the current scroll position
 */
export async function getScrollPosition(page: Page): Promise<number> {
  return page.evaluate(() => window.scrollY);
}

/**
 * Check if an element is in the viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}
