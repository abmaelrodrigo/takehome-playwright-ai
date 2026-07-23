<!-- ABOUTME: Candidate-facing take-home brief for the QA Automation Analyst role.
ABOUTME: Candidate uses AI to turn requirements into BDD test cases, then Playwright specs, against SauceDemo. -->

# Take-Home: AI-Assisted Playwright Automation

**Role:** QA Automation Analyst
**Time box:** ~3 hours (2–4). Partial work is fine if your reasoning is clear.
**Target app:** [https://www.saucedemo.com](https://www.saucedemo.com) — a public demo store. No account or VPN needed.

## Why this exercise

Our QA workflow is AI-driven: we turn requirements into structured test cases with AI, then
into automated Playwright tests, then run and report them. This exercise mirrors that. We are
**not** testing whether you can use an AI tool — we assume you can. We are testing whether you
can build a *repeatable* AI workflow and, most importantly, **verify and correct what the AI
gives you** instead of trusting it blindly.

## The app

SauceDemo login page lists the accepted usernames. Password for all users is `secret_sauce`.
Relevant users: `standard_user` (normal), `locked_out_user` (blocked).

## Requirements to test

These stories are intentionally short and slightly ambiguous. Note any assumptions you make.

- **US-1 — Login:** A user with valid credentials reaches the products page. Invalid credentials
  show an error.
- **US-2 — Locked-out user:** `locked_out_user` cannot log in and sees a specific blocked message.
- **US-3 — Cart:** Adding a product to the cart updates the cart badge count.
- **US-4 — Checkout validation:** Checkout requires First Name, Last Name, and Zip/Postal Code.
  Missing any required field shows an error.
- **US-5 — Order completion:** Completing checkout shows an order-confirmation message.

## What to deliver

Submit a Git repo (or zip) containing all five items below.

### 1. An AI test-case-generation "skill"
A **reusable prompt artifact** — a Claude Code `SKILL.md`, a Cursor rule, or a plain `PROMPT.md` —
that takes *any* requirement/user story as input and outputs structured test cases. This is the
core of the exercise: it should be parameterized and repeatable, not a one-off chat message.

Each generated test case must be **Given-When-Then (BDD)** and include: `title`, `precondition`,
`steps`, `expected result`, `priority`, `type` (positive/negative).

### 2. The generated test cases
The BDD test cases your skill produced for US-1 through US-5. Commit as `test-cases.md` or CSV.

### 3. Playwright implementation
TypeScript + `@playwright/test`. Automate the cases above. We expect:
- **Page Object Model** (or comparable structure).
- **Web-first assertions** (`expect(locator).toBeVisible()` etc.) — **no hard `waitForTimeout`/sleeps.**
- At least one **negative/edge** case (e.g. `locked_out_user`, or checkout with a missing field).
- Tests that **pass repeatably** on `npx playwright test`.

### 4. AI prompt log + verification notes
The prompts you used, and — explicitly — **at least two places where the AI was wrong or
incomplete and how you caught and fixed it.** Examples: a flaky wait it suggested, a wrong or
brittle selector, a missed edge case, a hallucinated API/matcher. This section carries a lot of
weight.

### 5. README
How to install and run, your design tradeoffs, assumptions/ambiguities you noticed in the
requirements, and what you'd add with more time.

## Ground rules

- **Use AI freely** (Claude, Copilot, Cursor, ChatGPT — your choice). It's encouraged.
- **Do not ship unverified AI output.** Every test must pass locally; include proof (the
  Playwright HTML report or a screenshot of a green run).
- Keep it simple and readable. We value clean, maintainable tests over cleverness.

## Submission

Share a repo link or zip with everything above. Expect a short follow-up conversation where we'll
ask you to walk through your AI skill and one of the bugs the AI introduced that you caught.
