import test, { expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("should load ok", async ({page}) => {
    await page.goto("/")
    await expect(page.locator("#contact-form")).toBeVisible();
  }) 

  test("should display validation errors from api", async ({page}) => {
    await page.goto("/?name=&email=Invalid+email&message=#contact")
    await expect(page.locator("#email-error")).toHaveText("Invalid email")
  })

  test("should redirect to thank you on submit", async({page}) => {
    await page.goto("/"); 

    await page.locator("#name").fill("test");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("test");

    await page.locator("#form-submit").click();
    await page.waitForURL("/thank-you");
  })
})