---
name: playwright-test-generator
description: Reads test-cases.md and generates/extends the Playwright + TypeScript automation (Page Object Model, web-first assertions, no waitForTimeout) required by deliverable "3. Playwright implementation" in the take-home brief. Use whenever asked to automate, implement, or turn BDD test cases into Playwright specs for this repo.
---

# Playwright Test Generator

Consumes the BDD test cases in `test-cases.md` (produced by the
`bdd-test-case-generator` skill) and produces the automation deliverable required by
section **"3. Playwright implementation"** of `takehome-playwright-ai (1).md`:

> TypeScript + `@playwright/test`. Automate the cases above. We expect:
> - Page Object Model (or comparable structure).
> - Web-first assertions (`expect(locator).toBeVisible()` etc.) — no hard `waitForTimeout`/sleeps.
> - At least one negative/edge case (e.g. `locked_out_user`, or checkout with a missing field).
> - Tests that pass repeatably on `npx playwright test`.

Unlike `bdd-test-case-generator`, this skill is **not** app-agnostic — it targets this repo's
existing Playwright project (`tests/`, `tests/pages/`, `tests/fixtures.ts`,
`playwright.config.ts`) and must stay consistent with it.

## Input contract

- Source of truth for behavior: `test-cases.md`. Every `TC-<REQ-ID>-NN` block there is a unit
  of work — its `Precondition`, `Given/When/Then` steps, and `Expected Result` map directly to
  test setup, actions, and assertions.
- Source of truth for the deliverable's constraints: section 3 of `takehome-playwright-ai (1).md`
  (or whichever spec file the user points at).
- Source of truth for real app behavior: the **live app**, not training data or the wording in
  `test-cases.md`. Selector names, error copy, and URLs must be confirmed against the DOM, not
  guessed — this project's `PROMPT_LOG.md` documents two cases where a plausible guess
  (`[data-test="cart-badge"]`, "Zip code is required") was wrong and only caught by running
  against the live site.

## Process

1. **Diff against existing coverage.** Read `tests/*.spec.ts` and extract which `TC-<ID>` values
   already have a `test(...)` block. Only generate/modify code for `TC-<ID>`s present in
   `test-cases.md` that are missing or stale (title/steps changed) — never blindly regenerate
   the whole suite, and never delete a passing test for a case still in `test-cases.md`.
2. **Verify before writing selectors.** For every new interaction or assertion target, drive a
   real (headless) browser against the target app first and capture the actual DOM: `data-test`
   attributes, class names, exact error copy, exact URLs. Do this with a small throwaway script
   or an ad-hoc Playwright run — never hand-write a selector or expected string from memory.
   Delete throwaway probe scripts once the real values are captured.
3. **Reuse or extend Page Objects.** Check `tests/pages/*.ts` for a class that already models the
   screen under test. Add a method to an existing Page Object before creating a new one. New
   Page Objects follow the existing shape: a `Page` field, `Locator` fields built from verified
   selectors, `async expect*` methods that wrap web-first assertions, and plain action methods
   (e.g. `login()`, `addToCartByName()`).
4. **Wire fixtures.** If a new Page Object is added, register it in `tests/fixtures.ts` following
   the existing `base.extend<Pages>({...})` pattern so specs consume it via the `test` fixture,
   not manual instantiation.
5. **Write specs.** One `test.describe('<REQ-ID>: <short title>', ...)` block per requirement,
   one `test('TC-<REQ-ID>-NN: <title>', ...)` per test case, using the exact `TC-<ID>` prefix
   from `test-cases.md` for traceability. Steps inside the test body follow the case's
   Given-When-Then, but only the **When** (action) and **Then** (assertion) need to be literal —
   **Given**/**And** context is usually just fixture setup (e.g. `loginAsStandardUser`).
6. **Assertions are web-first only.** Every check is `expect(locator).toBeVisible()`,
   `.toHaveText(...)`, `.toHaveURL(...)`, `.toHaveCount(...)`, etc. `page.waitForTimeout(...)` is
   never acceptable, even as a "just to be safe" addition — Playwright's auto-retrying
   assertions are the synchronization mechanism.
7. **Cover at least one negative/edge case.** If none of the newly-generated tests are `type:
   negative` per `test-cases.md`, do not consider the increment complete — go back to
   `test-cases.md` and include one (e.g. a locked-out user, a missing required field, an invalid
   sort/boundary condition).
8. **Run and prove it's green, twice.** Run `npx playwright test` (or scoped to the new spec
   file). A single green run is not proof of stability — run it a second time. If either run is
   flaky or red, fix the root cause (bad selector, wrong assertion, real app timing) — do not
   paper over it with a timeout or a retry bump. Report the pass/fail counts back to the user;
   don't claim success without having actually run the command.
9. **Update the paper trail.** Note in `PROMPT_LOG.md` any place where the DOM/copy verified in
   step 2 differed from what `test-cases.md` or a first-pass guess assumed — that's exactly the
   "AI was wrong, here's how it was caught" material the take-home's deliverable 4 asks for.

## Guardrails

- No `waitForTimeout`, no arbitrary `sleep`, no polling loops in place of a web-first assertion.
- No invented `data-test` attributes, CSS classes, error strings, or URLs — every one used in
  new code must trace back to a real DOM dump or a real failed-then-fixed assertion from this
  session, not memory of "how SauceDemo-like apps usually work."
- Keep Page Objects thin: locators + the actions/assertions for that one screen. Don't leak
  assertions about one page into another page's object.
- Test titles must start with the exact `TC-<REQ-ID>-NN` from `test-cases.md` so a reviewer can
  jump from `test-cases.md` to the spec and back.
- Don't restructure unrelated passing tests while adding new ones — scope changes to the
  requirement(s) actually being automated this run.
