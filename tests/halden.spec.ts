import { test, expect } from "@playwright/test";
test("HALDEN house page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/HALDEN/);
  const heroes = page.locator("section[aria-label] img");
  await expect(heroes).toHaveCount(3);
  await expect(heroes.nth(0)).toHaveAttribute("src", "/hero-cuff.png");
  await expect(heroes.nth(1)).toHaveAttribute("src", "/hero-coat.png");
  await expect(heroes.nth(2)).toHaveAttribute("src", "/hero-collar.png");
  await expect(page.locator("#lookbook li")).toHaveCount(4);
  await expect(page.getByRole("link", { name: "Lookbook" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "The House" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact" }).first()).toBeVisible();
  const body = await page.locator("body").innerText();
  expect(body.toLowerCase()).not.toContain("shop");
  expect(body.toLowerCase()).not.toContain("elevate your");
});
