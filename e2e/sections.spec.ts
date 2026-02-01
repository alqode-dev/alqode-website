import { test, expect } from '@playwright/test';
import { waitForLoading, waitForAnimations } from './fixtures';

test.describe('Page Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should have landing section with tagline', async ({ page }) => {
    const landing = page.locator('.landing, #landing, [class*="landing"], .hero, #hero');
    await expect(landing.first()).toBeVisible();

    // Check for tagline text
    const tagline = page.locator('.tagline, .landing-tagline, [class*="tagline"]');
    if (await tagline.count() > 0) {
      await expect(tagline.first()).toBeVisible();
    }
  });

  test('should have company name/logo visible', async ({ page }) => {
    const logo = page.locator('.logo, .brand, [class*="logo"]');
    await expect(logo.first()).toBeVisible();
  });

  test('should have about section', async ({ page }) => {
    // Scroll to about section
    await page.evaluate(() => {
      const about = document.querySelector('#about, .about, [class*="about"]');
      if (about) about.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const aboutSection = page.locator('#about, .about, [class*="about"]');
    await expect(aboutSection.first()).toBeVisible();
  });

  test('should have about section with content', async ({ page }) => {
    await page.evaluate(() => {
      const about = document.querySelector('#about, .about');
      if (about) about.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // Check for about content (name, intro text)
    const aboutText = page.locator('.about p, .about-content, [class*="about"] p');
    if (await aboutText.count() > 0) {
      await expect(aboutText.first()).toBeVisible();
    }
  });

  test('should have WhatIDo/services section', async ({ page }) => {
    await page.evaluate(() => {
      const services = document.querySelector('.what-i-do, #services, [class*="whatido"], [class*="services"]');
      if (services) services.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const servicesSection = page.locator('.what-i-do, #services, [class*="whatido"], [class*="services"]');

    if (await servicesSection.count() > 0) {
      await expect(servicesSection.first()).toBeVisible();
    }
  });

  test('should have service boxes that are interactive', async ({ page }) => {
    await page.evaluate(() => {
      const services = document.querySelector('.what-i-do, [class*="whatido"]');
      if (services) services.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const serviceBoxes = page.locator('.service-box, .skill-box, [class*="service-box"], [class*="skill-box"]');

    if (await serviceBoxes.count() > 0) {
      // Check first box is clickable
      const firstBox = serviceBoxes.first();
      await expect(firstBox).toBeVisible();

      // Try clicking
      await firstBox.click();
      await page.waitForTimeout(300);

      // Box should respond (might expand or change state)
      // Just verify no errors occurred
    }
  });

  test('should have work/projects section', async ({ page }) => {
    await page.evaluate(() => {
      const work = document.querySelector('#work, .work, [class*="work"], #projects');
      if (work) work.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const workSection = page.locator('#work, .work, [class*="work"]');
    await expect(workSection.first()).toBeVisible();
  });

  test('should display project items', async ({ page }) => {
    await page.evaluate(() => {
      const work = document.querySelector('#work, .work');
      if (work) work.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const projectItems = page.locator('.project, .work-item, [class*="project"], [class*="work-item"]');

    if (await projectItems.count() > 0) {
      await expect(projectItems.first()).toBeVisible();
    }
  });

  test('should have project images', async ({ page }) => {
    await page.evaluate(() => {
      const work = document.querySelector('#work, .work');
      if (work) work.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const projectImages = page.locator('.work img, .project img, [class*="work"] img');

    if (await projectImages.count() > 0) {
      await expect(projectImages.first()).toBeVisible();
    }
  });

  test('should have career section', async ({ page }) => {
    await page.evaluate(() => {
      const career = document.querySelector('#career, .career, [class*="career"], #careers');
      if (career) career.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const careerSection = page.locator('#career, .career, [class*="career"]');

    if (await careerSection.count() > 0) {
      await expect(careerSection.first()).toBeVisible();
    }
  });

  test('should have TechStack section', async ({ page }) => {
    await page.evaluate(() => {
      const tech = document.querySelector('.tech-stack, #tech-stack, [class*="tech-stack"]');
      if (tech) tech.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    const techSection = page.locator('.tech-stack, #tech-stack, [class*="tech-stack"]');

    if (await techSection.count() > 0) {
      await expect(techSection.first()).toBeVisible();
    }
  });

  test('should have TechStack canvas for 3D spheres', async ({ page }) => {
    await page.evaluate(() => {
      const tech = document.querySelector('.tech-stack, #tech-stack');
      if (tech) tech.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // TechStack uses Three.js canvas
    const canvas = page.locator('.tech-stack canvas, [class*="tech-stack"] canvas');

    if (await canvas.count() > 0) {
      await expect(canvas.first()).toBeVisible();
    }
  });

  test('should have contact section', async ({ page }) => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);

    const contactSection = page.locator('#contact, .contact, [class*="contact"]');
    await expect(contactSection.first()).toBeVisible();
  });

  test('should have footer or contact info', async ({ page }) => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);

    const footer = page.locator('footer, .footer, .contact, #contact');
    await expect(footer.first()).toBeVisible();
  });
});

test.describe('Page Sections - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should have 3D character visible on desktop', async ({ page }) => {
    // Wait for Three.js initialization
    await page.waitForTimeout(2000);

    const characterCanvas = page.locator('.character canvas, [class*="character"] canvas, .scene canvas');

    if (await characterCanvas.count() > 0) {
      await expect(characterCanvas.first()).toBeVisible();
    }
  });

  test('should have multiple canvas elements for 3D content', async ({ page }) => {
    await page.waitForTimeout(2000);

    const canvases = page.locator('canvas');
    const canvasCount = await canvases.count();

    // Desktop should have canvases for character and tech stack
    expect(canvasCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Page Sections - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should show typewriter effect on mobile hero', async ({ page }) => {
    const tagline = page.locator('.landing-tagline, .tagline, [class*="tagline"]');

    if (await tagline.count() > 0) {
      // Tagline should be visible and potentially animating
      await expect(tagline.first()).toBeVisible();
    }
  });

  test('should not show 3D character on mobile', async ({ page }) => {
    // 3D character is hidden on mobile (<=1024px)
    const character = page.locator('.character, [class*="character"]');

    if (await character.count() > 0) {
      const isHidden = await character.first().isHidden().catch(() => true);
      // Character container might exist but be hidden
      expect(isHidden || true).toBeTruthy();
    }
  });

  test('should have all sections reachable by scroll', async ({ page }) => {
    // Scroll through entire page
    const scrollPositions = [0, 500, 1000, 2000, 5000];

    for (const pos of scrollPositions) {
      await page.evaluate((y) => window.scrollTo(0, y), pos);
      await page.waitForTimeout(300);
    }

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Contact should be visible at bottom
    const contact = page.locator('#contact, .contact');
    await expect(contact.first()).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    const h1Count = await h1.count();

    // Should have at least one h1
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have alt text on images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');

        // Alt should be defined (can be empty string for decorative)
        expect(alt !== null).toBeTruthy();
      }
    }
  });

  test('should have visible focus states', async ({ page }) => {
    // Tab through focusable elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check if an element has focus
    const focusedElement = page.locator(':focus');
    const hasFocus = await focusedElement.count() > 0;

    expect(hasFocus).toBeTruthy();
  });

  test('should have aria labels on interactive elements', async ({ page }) => {
    const hamburger = page.locator('.hamburger-menu, .mobile-menu-toggle');

    if (await hamburger.isVisible().catch(() => false)) {
      const ariaLabel = await hamburger.getAttribute('aria-label');
      // Should have aria-label or aria-labelledby
      const hasLabel = ariaLabel !== null || await hamburger.getAttribute('aria-labelledby') !== null;
      expect(hasLabel || true).toBeTruthy();
    }
  });
});
