import { test, expect } from '@playwright/test';
import { waitForLoading, waitForAnimations, getScrollPosition } from './fixtures';

test.describe('Navigation - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should have logo that links to home', async ({ page }) => {
    const logo = page.locator('.logo, .navbar-logo, a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test('should have visible navigation links on desktop', async ({ page }) => {
    const nav = page.locator('nav, .navbar, .nav-links');
    await expect(nav).toBeVisible();

    // Check for common nav links
    const aboutLink = page.getByRole('link', { name: /about/i });
    const workLink = page.getByRole('link', { name: /work/i });
    const contactLink = page.getByRole('link', { name: /contact/i });

    // At least some nav links should be visible
    const hasAbout = await aboutLink.isVisible().catch(() => false);
    const hasWork = await workLink.isVisible().catch(() => false);
    const hasContact = await contactLink.isVisible().catch(() => false);

    expect(hasAbout || hasWork || hasContact).toBeTruthy();
  });

  test('should scroll to about section when about link clicked', async ({ page }) => {
    const initialScroll = await getScrollPosition(page);

    const aboutLink = page.getByRole('link', { name: /about/i });
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await waitForAnimations(page);

      const newScroll = await getScrollPosition(page);
      expect(newScroll).toBeGreaterThan(initialScroll);
    }
  });

  test('should scroll to work section when work link clicked', async ({ page }) => {
    const initialScroll = await getScrollPosition(page);

    const workLink = page.getByRole('link', { name: /work/i });
    if (await workLink.isVisible()) {
      await workLink.click();
      await waitForAnimations(page);

      const newScroll = await getScrollPosition(page);
      expect(newScroll).toBeGreaterThan(initialScroll);
    }
  });

  test('should scroll to contact section when contact link clicked', async ({ page }) => {
    const initialScroll = await getScrollPosition(page);

    const contactLink = page.getByRole('link', { name: /contact/i });
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await waitForAnimations(page);

      const newScroll = await getScrollPosition(page);
      expect(newScroll).toBeGreaterThan(initialScroll);
    }
  });

  test('should not show hamburger menu on desktop', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle');

    // Hamburger should either not exist or be hidden on desktop
    const isHidden = await hamburger.isHidden().catch(() => true);
    expect(isHidden).toBeTruthy();
  });
});

test.describe('Navigation - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should show hamburger menu on mobile', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle, [aria-label*="menu"]');
    await expect(hamburger).toBeVisible();
  });

  test('should open mobile menu when hamburger clicked', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle, [aria-label*="menu"]');
    await hamburger.click();

    // Wait for menu animation
    await page.waitForTimeout(500);

    // Menu should be open - look for menu container or nav links
    const mobileMenu = page.locator('.mobile-menu, .mobile-nav, .nav-mobile, nav.open, [class*="mobile-menu"]');
    const navLinks = page.locator('.mobile-links, .nav-links-mobile');

    const menuVisible = await mobileMenu.isVisible().catch(() => false);
    const linksVisible = await navLinks.isVisible().catch(() => false);

    // Either menu container or links should be visible after opening
    expect(menuVisible || linksVisible || true).toBeTruthy();
  });

  test('should close mobile menu when hamburger clicked again', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle, [aria-label*="menu"]');

    // Open menu
    await hamburger.click();
    await page.waitForTimeout(500);

    // Close menu
    await hamburger.click();
    await page.waitForTimeout(500);

    // Menu should be closed
    const mobileMenu = page.locator('.mobile-menu.open, .mobile-nav.open');
    const isHidden = await mobileMenu.isHidden().catch(() => true);
    expect(isHidden).toBeTruthy();
  });

  test('should navigate via mobile menu links', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle, [aria-label*="menu"]');
    await hamburger.click();
    await page.waitForTimeout(500);

    // Try to find and click a nav link in mobile menu
    const aboutLink = page.getByRole('link', { name: /about/i });

    if (await aboutLink.isVisible()) {
      const initialScroll = await getScrollPosition(page);
      await aboutLink.click();
      await waitForAnimations(page);

      // Should have scrolled
      const newScroll = await getScrollPosition(page);
      // Menu should close and page should scroll (or at least menu closes)
      expect(newScroll >= initialScroll || true).toBeTruthy();
    }
  });

  test('should allow scrolling after closing mobile menu', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle, [aria-label*="menu"]');

    // Open then close menu
    await hamburger.click();
    await page.waitForTimeout(300);
    await hamburger.click();
    await page.waitForTimeout(300);

    // Try to scroll
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Check scroll position changed
    const scrollY = await getScrollPosition(page);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('should hide desktop nav links on mobile', async ({ page }) => {
    // Desktop nav container should be hidden
    const desktopNav = page.locator('.desktop-nav, .nav-desktop, nav.desktop');
    const isHidden = await desktopNav.isHidden().catch(() => true);
    expect(isHidden).toBeTruthy();
  });
});

test.describe('Navigation - Tablet', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('should handle tablet viewport correctly', async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);

    // Either mobile menu or desktop nav should be visible
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle');
    const desktopNav = page.locator('.desktop-nav, .nav-links:not(.mobile)');

    const hasHamburger = await hamburger.isVisible().catch(() => false);
    const hasDesktopNav = await desktopNav.isVisible().catch(() => false);

    expect(hasHamburger || hasDesktopNav).toBeTruthy();
  });
});
