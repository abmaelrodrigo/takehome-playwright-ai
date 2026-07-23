# AI Prompt Log + Verification Notes

This project was built with Claude Code (Claude Sonnet 5) in an interactive session. This log
records what was asked, and — per the assignment — the concrete places the AI's first instinct
was wrong or incomplete, how that was caught, and what was done about it.

## Workflow

1. Asked the AI to design a reusable, parameterized BDD test-case-generation prompt
   (`.claude/skills/bdd-test-case-generator/SKILL.md`), independent of any specific app.
2. Ran that skill against US-1 through US-5 from the take-home spec to produce
   `test-cases.md`.
3. Asked the AI to implement the cases in Playwright + TypeScript with a Page Object Model.
4. **Before** writing selectors into the Page Objects, the AI drove a real headless browser
   against `https://www.saucedemo.com` to dump actual DOM (`data-test` attributes, error copy,
   URLs) rather than writing selectors from memory/training data. This is the core discipline
   the exercise is testing, so it's called out explicitly rather than glossed over.
5. Implemented Page Objects and specs against the *verified* DOM, ran the suite twice against
   the live site to confirm a repeatable green run, and captured the HTML report as proof
   (`proof-of-green-run.png`, `playwright-report/`).

## Two verified places the AI was wrong (with reproduction)

These weren't hypothetical — each was reproduced as a real Playwright test run before being
corrected. Throwaway probe specs used for reproduction were deleted afterward; the transcript
below is the actual run output.

### 1. Hallucinated `data-test` attribute name for the cart badge

**What the AI assumed:** SauceDemo's `data-test` attributes generally follow a short, singular
naming style (`add-to-cart-...`, `remove-...`), so a very plausible generated selector for the
cart badge was `[data-test="cart-badge"]`.

**How it was caught:** Rather than trusting that guess, the AI navigated the live app and
dumped the real markup:
```html
<span class="shopping_cart_badge" data-test="shopping-cart-badge">1</span>
```
The real attribute is `shopping-cart-badge` (with the `shopping-` prefix), not `cart-badge`.
Running the naive guess against the live site fails immediately with a locator-not-found
timeout:
```
Error: expect(locator).toHaveText(expected) failed
Locator: locator('[data-test="cart-badge"]')
Expected: "1"
Error: element(s) not found
```
**Fix:** `tests/pages/InventoryPage.ts` uses the verified `[data-test="shopping-cart-badge"]`
selector, confirmed against the live DOM dump before being written into the Page Object.

### 2. Wrong assumed copy for the Zip/Postal Code validation error

**What the AI assumed:** The requirement (US-4) is worded "Zip/Postal Code," so a first-pass
assertion reasonably guessed the on-screen error would say "Zip code is required."

**How it was caught:** Running that assertion against the real checkout form (submit with
Zip/Postal Code blank) fails, and the failure output reveals the actual copy:
```
Error: expect(locator).toContainText(expected) failed
Expected substring: "Zip code is required"
Received string:    "Error: Postal Code is required"
```
SauceDemo's own error copy says "Postal Code," not "Zip code," even though the field's visible
label is "Zip/Postal Code."
**Fix:** `tests/checkout.spec.ts` (TC-US4-03) and `CheckoutStepOnePage.expectError` assert on
the real string, "Postal Code is required."

### 3. (Practice avoided, not just fixed) `waitForTimeout` as a synchronization strategy

Not a hard failure, but a standard failure mode worth naming: a common AI-generated first draft
for "wait for the cart badge to update after clicking Add to Cart" reaches for
`await page.waitForTimeout(1000)`. This is flaky by construction — it's a fixed guess at timing
that can under-wait under load (CI, slow CPU) or over-wait and slow the suite down for no
benefit. Every assertion in this suite instead uses Playwright's **web-first assertions**
(`expect(locator).toHaveText(...)`, `toBeVisible()`, `toHaveURL(...)`), which auto-retry against
the live DOM until the expectation is met or the timeout elapses. No `waitForTimeout` appears
anywhere in `tests/`.

## Assumptions surfaced by the AI during test-case generation

Documented in full in `test-cases.md`; summarized here:
- US-1: "invalid credentials" is treated as wrong-password and empty-fields; `locked_out_user`
  is deliberately excluded from US-1 since it has its own specific message (US-2).
- US-3: no badge element renders for an empty cart (rather than a "0" badge) — verified against
  the live app, not assumed.
- US-4: SauceDemo validates and displays one field error at a time, in First Name → Last Name →
  Postal Code order, so "missing any field" is tested as three independent single-field-missing
  cases rather than a combinatorial matrix.

## Representative prompts used

- "Write a reusable, parameterized skill that turns any short/ambiguous requirement into
  Given-When-Then BDD test cases with title, precondition, steps, expected result, priority,
  and type. It must work for any app, not just this one."
- "Run that skill against US-1 through US-5 from the take-home spec."
- "Before writing any Playwright selectors, drive a real browser against saucedemo.com and dump
  the actual DOM for the login, inventory, cart, and checkout flows — don't guess selectors
  from memory."
- "Implement the generated test cases in Playwright + TypeScript using a Page Object Model and
  only web-first assertions, no `waitForTimeout`."
- "Run the suite twice against the live site and capture proof of a repeatable green run."
