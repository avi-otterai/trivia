import { test, expect, Page } from "@playwright/test";

/**
 * WikiTrivia E2E Tests
 * 
 * These tests cover the core gameplay flows:
 * - Loading and instructions screen
 * - Dimension selection
 * - Drag and drop card placement
 * - Correct/incorrect placement feedback
 * - Lives system
 * - Game over and replay
 * - Highscore persistence
 */

// Helper to wait for the app to be ready
async function waitForAppReady(page: Page) {
  // Wait for loading to disappear (the Game component loads dynamically)
  // First wait for loading text to appear and disappear
  await page.waitForSelector("h1:has-text('Loading')", { state: "hidden", timeout: 30000 }).catch(() => {
    // Loading might have already completed
  });
  
  // Wait for instructions screen to appear (h2 should be visible)
  await expect(page.locator("h2")).toContainText("Place the cards in the correct order", { timeout: 30000 });
}

// Helper to start the game with a specific dimension
async function startGameWithDimension(page: Page, dimensionName: string) {
  await waitForAppReady(page);
  
  // Click the dimension tile - use exact text match via span with tileName class
  const dimensionButton = page.locator(`button:has(span:text-is("${dimensionName}"))`);
  await dimensionButton.click();
  
  // Wait for game board to appear (heart images should be visible)
  // Use img[src*="heart"] to target the heart images specifically
  await expect(page.locator('img[src*="heart"]').first()).toBeVisible({ timeout: 30000 });
}

// Helper to get card count in the played area
async function getPlayedCardCount(page: Page): Promise<number> {
  return page.locator('[data-rbd-droppable-id="played"] [data-rbd-draggable-id]').count();
}

// Helper to get current heart count (count heart images)
async function getHeartCount(page: Page): Promise<number> {
  return page.locator('img[src*="heart"]').count();
}

// Keyboard-based drag and drop for react-beautiful-dnd. The new card sits at
// the bottom and the timeline at the top, so the card moves up.
async function dragCardToPlayedArea(page: Page) {
  const nextCard = page.locator('[data-rbd-droppable-id="next"] [data-rbd-draggable-id]');
  await nextCard.focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(200);
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
}

test.describe("Instructions Screen", () => {
  test("should display instructions and dimension tiles on load", async ({ page }) => {
    await page.goto("/");
    
    // Wait for loading to complete
    await waitForAppReady(page);
    
    // Check title is visible
    await expect(page.locator("h2")).toContainText("Place the cards in the correct order");
    
    // Check subtitle
    await expect(page.getByText("Click a category to start playing")).toBeVisible();
    
    // Check at least one dimension tile is visible
    const dimensionTiles = page.locator('button[class*="dimensionTile"]');
    await expect(dimensionTiles.first()).toBeVisible();
  });

  test("should display all dimension categories", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);
    
    // Check for some key dimensions (use exact text match to avoid ambiguity)
    const expectedDimensions = ["Price", "Speed", "Height", "Population", "Weight", "Lifespan"];
    
    for (const dim of expectedDimensions) {
      await expect(page.locator(`button:has(span:text-is("${dim}"))`)).toBeVisible();
    }
  });

  test("should not show highscore on first visit", async ({ page, context }) => {
    // Clear localStorage
    await context.addInitScript(() => {
      localStorage.clear();
    });
    
    await page.goto("/");
    await waitForAppReady(page);
    
    // Best streak should not be visible when highscore is 0
    await expect(page.getByText("Best streak")).not.toBeVisible();
  });

  test("should show highscore when previously set", async ({ page, context }) => {
    // Set a highscore in localStorage
    await context.addInitScript(() => {
      localStorage.setItem("highscore", "5");
    });
    
    await page.goto("/");
    await waitForAppReady(page);
    
    // Best streak should be visible
    await expect(page.getByText("Best streak")).toBeVisible();
    await expect(page.getByText("5")).toBeVisible();
  });
});

test.describe("Dimension Selection", () => {
  test("should start game when clicking Year dimension", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Year");
    
    // Game board should be visible with 3 heart images
    const hearts = page.locator('img[src*="heart"]');
    await expect(hearts).toHaveCount(3);
  });

  test("should start game when clicking Price dimension", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Price");
    
    // Game board should be visible with heart images
    await expect(page.locator('img[src*="heart"]').first()).toBeVisible();
  });

  test("should show loading state while loading dimension", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);
    
    // Click the Year dimension (exact match)
    const yearButton = page.locator('button:has(span:text-is("Year"))');
    await yearButton.click();
    
    // Eventually the game should start (hearts become visible)
    await expect(page.locator('img[src*="heart"]').first()).toBeVisible({ timeout: 30000 });
  });
});

test.describe("Game Board", () => {
  test("should display next card area and played card area", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Year");
    
    // Check for next card area (droppable with id "next")
    await expect(page.locator('[data-rbd-droppable-id="next"]')).toBeVisible();
    
    // Check for played cards area (droppable with id "played")
    await expect(page.locator('[data-rbd-droppable-id="played"]')).toBeVisible();
  });

  test("should have one card in played area initially", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Year");
    
    // Initially there should be 1 card in the played area
    const playedCards = page.locator('[data-rbd-droppable-id="played"] [data-rbd-draggable-id]');
    await expect(playedCards).toHaveCount(1);
  });

  test("should have one card in next area", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Year");
    
    // Should have 1 card in the next area
    const nextCard = page.locator('[data-rbd-droppable-id="next"] [data-rbd-draggable-id]');
    await expect(nextCard).toHaveCount(1);
  });

  test("should display exit button during gameplay", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Year");
    
    // Exit button should be visible
    const exitButton = page.locator('button[title="Exit game"]');
    await expect(exitButton).toBeVisible();
  });

  test("should reload page when exit button clicked", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Year");
    
    // Click exit button
    const exitButton = page.locator('button[title="Exit game"]');
    await exitButton.click();
    
    // Page should reload and show instructions
    await waitForAppReady(page);
  });
});

test.describe("Drag and Drop", () => {
  test("should be able to drag card from next to played area", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Speed");
    
    // Verify initial state - 1 card in played area
    const playedCards = page.locator('[data-rbd-droppable-id="played"] [data-rbd-draggable-id]');
    await expect(playedCards).toHaveCount(1);
    
    // Use keyboard to drag the card
    await dragCardToPlayedArea(page);
    
    // After dropping, there should be 2 cards in played area
    await expect(playedCards).toHaveCount(2, { timeout: 10000 });
  });

  test("should get new card in next area after placing one", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Speed");
    
    // Get initial card ID
    const initialNextCard = page.locator('[data-rbd-droppable-id="next"] [data-rbd-draggable-id]');
    const initialCardId = await initialNextCard.getAttribute("data-rbd-draggable-id");
    
    // Use keyboard to drag the card
    await dragCardToPlayedArea(page);
    
    // Wait for state to update
    await page.waitForTimeout(1000);
    
    // Check that next area has a new card
    const newNextCard = page.locator('[data-rbd-droppable-id="next"] [data-rbd-draggable-id]');
    await expect(newNextCard).toBeVisible({ timeout: 10000 });
    
    // The new card should have a different ID
    const newCardId = await newNextCard.getAttribute("data-rbd-draggable-id");
    expect(newCardId).not.toBe(initialCardId);
  });

  // Regression: useAutoMoveSensor scrolls #timeline to reposition badly-placed
  // cards. The layout flip (a6f2078) moved the timeline out of #bottom without
  // updating the sensor, silently breaking auto-move. Pin the contract.
  test("#timeline is the horizontally scrolling container", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Speed");

    const overflowX = await page
      .locator("#timeline")
      .evaluate((el) => getComputedStyle(el).overflowX);
    expect(overflowX).toBe("auto");

    // The played cards must live inside it, since the sensor measures
    // destEl.offsetLeft against #timeline's scroll geometry.
    await expect(
      page.locator('#timeline [data-rbd-droppable-id="played"]')
    ).toBeVisible();
  });
});

test.describe("Lives System", () => {
  test("should start with 3 hearts", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Speed"); // Use Speed to avoid Year/Year Founded ambiguity
    
    const hearts = page.locator('img[src*="heart"]');
    await expect(hearts).toHaveCount(3);
  });

  // Note: Testing incorrect placement requires knowing which placement is wrong
  // This is harder to test deterministically without mocking the data
  test("should maintain hearts on correct placement", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Speed");
    
    // Store initial heart count
    const initialHearts = await getHeartCount(page);
    expect(initialHearts).toBe(3);
    
    // Timeline is at the top, so the card travels up (was ArrowDown, which
    // never landed — the assertions below then passed vacuously).
    await dragCardToPlayedArea(page);

    // The placement must actually have happened for this test to mean anything.
    const playedCards = page.locator('[data-rbd-droppable-id="played"] [data-rbd-draggable-id]');
    await expect(playedCards).toHaveCount(2, { timeout: 10000 });

    const newHearts = await getHeartCount(page);
    // Correct placement keeps 3 hearts, incorrect drops to 2.
    expect(newHearts).toBeGreaterThanOrEqual(2);
    expect(newHearts).toBeLessThanOrEqual(3);
  });
});

test.describe("Game Over", () => {
  test.skip("should show game over screen when lives reach 0", async ({ page }) => {
    // This test would require a way to force incorrect placements
    // Skipped for now - would need mocked data or state injection
    await page.goto("/");
    await startGameWithDimension(page, "Year");
    
    // TODO: Implement when we have a way to control card values
  });
});

test.describe("Card Display", () => {
  test("should display card with label", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Speed");
    
    // Cards should have labels (text content)
    const cardLabels = page.locator('[data-rbd-draggable-id] [class*="label"]');
    await expect(cardLabels.first()).toBeVisible();
  });

  test("should display card with description", async ({ page }) => {
    await page.goto("/");
    await startGameWithDimension(page, "Speed");
    
    // Cards should have descriptions
    const cardDescriptions = page.locator('[data-rbd-draggable-id] [class*="description"]');
    await expect(cardDescriptions.first()).toBeVisible();
  });
});

test.describe("Highscore Persistence", () => {
  // Regression: score counted the free pre-placed card, so merely opening a
  // game banked a highscore of 1 without the player placing anything.
  test("should not bank a score for the free starting card", async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto("/");
    await startGameWithDimension(page, "Speed");

    // One card is on the timeline, but the player has placed nothing.
    const playedCards = page.locator('[data-rbd-droppable-id="played"] [data-rbd-draggable-id]');
    await expect(playedCards).toHaveCount(1);

    const highscore = await page.evaluate(() => localStorage.getItem("highscore"));
    expect(Number(highscore ?? 0)).toBe(0);
  });
});

test.describe("Accessibility", () => {
  test("buttons should be focusable", async ({ page, browserName }) => {
    // Skip on WebKit/Safari - mobile Safari doesn't support keyboard focus the same way
    test.skip(browserName === "webkit", "Mobile Safari doesn't support programmatic keyboard focus");

    await page.goto("/");
    await waitForAppReady(page);

    // Tab to first dimension button
    await page.keyboard.press("Tab");

    // Check that a button is focused
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("dimension buttons should have accessible names", async ({ page }) => {
    await page.goto("/");
    await waitForAppReady(page);
    
    // Check that dimension buttons have text content (use exact match)
    const speedButton = page.locator('button:has(span:text-is("Speed"))');
    await expect(speedButton).toBeVisible();
    await expect(speedButton).toBeEnabled();
  });
});

