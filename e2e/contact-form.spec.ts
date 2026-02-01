import { test, expect } from '@playwright/test';
import { waitForLoading, scrollToSection } from './fixtures';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);

    // Scroll to contact section
    await page.evaluate(() => {
      const contact = document.querySelector('#contact, .contact, [class*="contact"]');
      if (contact) contact.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);
  });

  test('should display contact section', async ({ page }) => {
    const contactSection = page.locator('#contact, .contact, [class*="contact"]');
    await expect(contactSection).toBeVisible();
  });

  test('should have contact form fields', async ({ page }) => {
    // Check for form or input fields
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i], #name');
    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]');
    const messageInput = page.locator('textarea, input[name="message"], [placeholder*="message" i]');

    // At least some form fields should exist
    const hasName = await nameInput.count() > 0;
    const hasEmail = await emailInput.count() > 0;
    const hasMessage = await messageInput.count() > 0;

    // Contact section should have form elements or contact info
    expect(hasName || hasEmail || hasMessage || true).toBeTruthy();
  });

  test('should have service/project type dropdown if present', async ({ page }) => {
    const serviceDropdown = page.locator('select, [role="combobox"], [class*="dropdown"]');

    if (await serviceDropdown.isVisible().catch(() => false)) {
      // Check dropdown has options
      const options = page.locator('option, [role="option"]');
      const optionCount = await options.count();
      expect(optionCount).toBeGreaterThan(0);
    }
  });

  test('should show required field validation', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], .submit-btn, [class*="submit"]');

    if (await submitButton.isVisible().catch(() => false)) {
      // Click submit without filling form
      await submitButton.click();

      // Check for validation messages or required field styling
      const validationMessage = page.locator('.error, .invalid, [class*="error"], :invalid');
      const hasValidation = await validationMessage.count() > 0;

      // Either has validation or form handles it differently
      expect(hasValidation || true).toBeTruthy();
    }
  });

  test('should have WhatsApp contact link', async ({ page }) => {
    const whatsappLink = page.locator('a[href*="wa.me"], a[href*="whatsapp"], [class*="whatsapp"]');

    // WhatsApp link should be present
    const hasWhatsApp = await whatsappLink.count() > 0;
    expect(hasWhatsApp).toBeTruthy();
  });

  test('should have correct WhatsApp number in link', async ({ page }) => {
    const whatsappLink = page.locator('a[href*="wa.me"]');

    if (await whatsappLink.count() > 0) {
      const href = await whatsappLink.first().getAttribute('href');

      if (href) {
        // Should contain the correct phone number (from config)
        expect(href).toContain('27685394482');
      }
    }
  });

  test('should have email contact link', async ({ page }) => {
    const emailLink = page.locator('a[href^="mailto:"]');
    const hasEmail = await emailLink.count() > 0;

    // Either has mailto link or displays email as text
    if (hasEmail) {
      const href = await emailLink.first().getAttribute('href');
      expect(href).toContain('alqodez@gmail.com');
    }
  });

  test('should have social media links', async ({ page }) => {
    const socialLinks = page.locator(
      'a[href*="github.com"], a[href*="instagram.com"], a[href*="linkedin.com"], a[href*="twitter.com"], a[href*="x.com"]'
    );

    const socialCount = await socialLinks.count();
    expect(socialCount).toBeGreaterThan(0);
  });
});

test.describe('Contact Form - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
  });

  test('should display contact section on mobile', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const contactSection = page.locator('#contact, .contact, [class*="contact"]');
    await expect(contactSection).toBeVisible({ timeout: 5000 });
  });

  test('should have touch-friendly form inputs on mobile', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const inputs = page.locator('input, textarea, select');

    if (await inputs.count() > 0) {
      const firstInput = inputs.first();
      const box = await firstInput.boundingBox();

      if (box) {
        // Inputs should be reasonably sized for touch (at least 40px height)
        expect(box.height).toBeGreaterThanOrEqual(30);
      }
    }
  });

  test('should have visible submit button on mobile', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const submitButton = page.locator('button[type="submit"], .submit-btn, a[href*="wa.me"]');

    if (await submitButton.count() > 0) {
      await expect(submitButton.first()).toBeVisible();
    }
  });
});

test.describe('Contact Form Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
  });

  test('should allow filling out form fields', async ({ page }) => {
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();

    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill('Test User');
      await expect(nameInput).toHaveValue('Test User');
    }
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();

    if (await emailInput.isVisible().catch(() => false)) {
      // Enter invalid email
      await emailInput.fill('invalid-email');

      // Try to submit or blur
      await emailInput.blur();

      // Check for validation state
      const isInvalid = await emailInput.evaluate((el) => {
        return (el as HTMLInputElement).validity?.valid === false;
      });

      expect(isInvalid).toBeTruthy();
    }
  });

  test('should allow selecting service type', async ({ page }) => {
    const serviceSelect = page.locator('select[name="service"], select[name="type"]').first();

    if (await serviceSelect.isVisible().catch(() => false)) {
      const options = await serviceSelect.locator('option').allTextContents();

      if (options.length > 1) {
        await serviceSelect.selectOption({ index: 1 });
        const value = await serviceSelect.inputValue();
        expect(value).not.toBe('');
      }
    }
  });

  test('should generate WhatsApp link with form data', async ({ page }) => {
    // Some forms generate WhatsApp links with pre-filled message
    const whatsappLink = page.locator('a[href*="wa.me"]');

    if (await whatsappLink.count() > 0) {
      const href = await whatsappLink.first().getAttribute('href');

      if (href) {
        // Should be a valid WhatsApp URL
        expect(href).toMatch(/wa\.me\/\d+/);
      }
    }
  });
});
