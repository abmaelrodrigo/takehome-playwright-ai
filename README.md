# Take-Home: AI-Assisted Playwright Automation (SauceDemo)

QA automation for [saucedemo.com](https://www.saucedemo.com), covering US-1 through US-5 from
the take-home spec. Built with an AI-driven workflow: requirement → BDD test cases → Playwright
implementation → verified, repeatable green run.

## What's in here

| # | Deliverable | Location |
|---|---|---|
| 1 | Reusable AI test-case-generation skill | [`.claude/skills/bdd-test-case-generator/SKILL.md`](.claude/skills/bdd-test-case-generator/SKILL.md) |
| 2 | Generated BDD test cases for US-1..US-5 | [`test-cases.md`](test-cases.md) |
| 3 | Playwright + TypeScript implementation | [`tests/`](tests/) |
| 4 | AI prompt log + verification notes | [`PROMPT_LOG.md`](PROMPT_LOG.md) |
| 5 | This README | — |

Proof of a green run: [`proof-of-green-run.png`](proof-of-green-run.png) (screenshot of the
Playwright HTML report, 12/12 passed). Run `npm run report` after `npm test` to view the live,
interactive HTML report yourself.

## Install and run

Requires Node.js 18+.

```bash
npm install
npx playwright install chromium webkit
npm test              # runs the full suite headless against the live saucedemo.com,
                       # across desktop Chromium, Mobile Chrome (Pixel 5), and Mobile Safari (iPhone 12)
npm run test:headed   # same, with a visible browser
npm run report        # opens the last HTML report
```

Tests run against the real public site (no mocking, no local server needed) and pass
repeatably — verified with two consecutive full runs during development.

## Design

- **Page Object Model**: one class per page/step under `tests/pages/` (`LoginPage`,
  `InventoryPage`, `CartPage`, `CheckoutStepOnePage`, `CheckoutStepTwoPage`,
  `CheckoutCompletePage`). Each exposes locators and intention-revealing actions
  (`login()`, `addToCartByName()`, `expectError()`) — specs never touch raw selectors.
- **Fixtures** (`tests/fixtures.ts`): a `test.extend` wires all Page Objects in as fixtures, so
  specs destructure exactly the pages they need instead of manually constructing objects.
- **Web-first assertions only**: every check is `expect(locator).toBeVisible()` /
  `toHaveText()` / `toHaveURL()` / `toHaveCount()`, which auto-retry against the live DOM.
  No `waitForTimeout` or manual sleeps anywhere.
- **Selectors**: prefer `data-test` attributes (SauceDemo's own test hooks) over CSS classes or
  text, since they're the most stable contract the app exposes. Verified against the live DOM
  before being written into code — see `PROMPT_LOG.md` for two cases where a plausible AI guess
  at a selector/error string was wrong and had to be corrected after checking the real page.
- **Negative/edge coverage**: wrong password, empty login fields, `locked_out_user`, and all
  three required-field-missing checkout cases are covered, not just the happy path.

## Assumptions / ambiguities

The stories are intentionally short; assumptions made while turning them into test cases are
documented inline in `test-cases.md` under each user story's `#### Assumptions` section.
Highlights:
- US-1's "invalid credentials" is tested as wrong-password and empty-fields;
  `locked_out_user` is scoped to US-2 since it has a distinct, specific message.
- US-3 assumes no cart badge is rendered at all when the cart is empty (verified against the
  live app, rather than assuming a "0" badge).
- US-4 assumes SauceDemo's real behavior of showing one validation error at a time, in field
  order (First Name → Last Name → Postal Code), so "missing any field" is tested as three
  independent single-field cases.

## What I'd add with more time

- A cross-browser matrix (Firefox/WebKit projects) — currently Chromium-only for speed.
- API-level or storage-state-based login setup to remove the repeated UI login in checkout
  specs, once more scenarios are added and that overhead starts to matter.
- CI wiring (GitHub Actions) running `npx playwright test` on push, with the HTML report
  uploaded as a build artifact.
- A visual regression check on the checkout-complete page (`toHaveScreenshot`), if the team
  wants stronger evidence than "the confirmation header text is present."
- Data-driven checkout tests (e.g. a `test.each`-style parameterization over which field is
  missing) if the number of required-field permutations grows.
