import test, { expect } from "@playwright/test";
import { initDevServer, type DevServer } from "./utils";

let devServer: DevServer;

test.beforeAll(async () => {
  devServer = await initDevServer("http://localhost:3000");
});

test.afterAll(() => {
  if (devServer) {
    devServer.kill("SIGTERM");
  }
});

test.describe("Contact form", () => {
  test("should load ok", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#contact-form")).toBeVisible();
  });

  test("should redirect to thank you on submit", async ({ page }) => {
    await page.goto("/");

    await page.locator("#name").fill("test");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("test");

    await page.locator("#form-submit").click();
    await page.waitForURL("/thank-you");
  });
});

test.describe("Social media links", () => {
  test("should load ok", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#github")).toBeVisible();
    await expect(page.locator("#linkedin")).toBeVisible();
    await expect(page.locator("#twitter")).toBeVisible();
  });

  test("github link should navigate to correct url", async ({ page }) => {
    await page.goto("/");

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page.locator("#github").click(),
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toBe("https://github.com/raswonders");
  });

  test("linkedin link should navigate to correct url", async ({ page }) => {
    await page.goto("/");

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page.locator("#linkedin").click(),
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toBe("https://www.linkedin.com/in/rastislavhepner/");
  });

  test("twitter link should navigate to correct url", async ({ page }) => {
    await page.goto("/");

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page.locator("#twitter").click(),
    ]);

    await newPage.waitForLoadState();
    expect(newPage.url()).toBe("https://x.com/raswonders");
  });
});
