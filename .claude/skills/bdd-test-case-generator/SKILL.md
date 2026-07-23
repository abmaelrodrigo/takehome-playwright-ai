---
name: bdd-test-case-generator
description: Turns any short/ambiguous requirement or user story into structured Given-When-Then (BDD) test cases with title, precondition, steps, expected result, priority, and type (positive/negative). Use whenever asked to generate test cases, acceptance tests, or QA scenarios from a requirement, ticket, or user story.
---

# BDD Test-Case Generator

A reusable, parameterized prompt. Input is **one requirement/user story** (any domain, any
app). Output is a set of structured BDD test cases in the exact format below — never prose,
never a to-do list, never implementation code.

This skill is deliberately app-agnostic: it does not know about any specific product's UI or
selectors. It only reasons about *behavior*. Test automation (Playwright, Cypress, etc.) is a
separate, later step that consumes this skill's output.

## Input contract

You will be given:
- A requirement or user story, usually short and possibly ambiguous (e.g. a one- or two-line
  Jira-style ticket).
- Optionally, extra context (app name, relevant business rules, user roles).

If context is missing that materially changes test design (e.g. "what happens on the 2nd
invalid attempt?", "is there a lockout?"), **do not invent hidden requirements**. Instead:
1. Make the most reasonable, industry-standard assumption.
2. State it explicitly in an `## Assumptions` block under the requirement, so a human reviewer
   can correct it.

## Process

1. **Restate the requirement in one line** so drift is visible if the source ticket changes.
2. **Enumerate scenarios** covering:
   - The primary/happy path (at least one positive case).
   - At least one negative/edge case per requirement, when the requirement implies validation,
     authentication, or a state that can fail (empty input, wrong input, boundary values,
     already-in-a-state actions). If a requirement is purely cosmetic/informational with no
     failure mode, it's acceptable to have only positive cases — but say so.
   - Boundary/edge conditions only when they're plausible for the stated requirement — don't
     pad the list with scenarios that don't map to the story.
3. **Assign priority** using this rubric (state it if you deviate):
   - `High` — blocks the core user journey or is a security/data-integrity concern.
   - `Medium` — secondary validation, alternate paths, non-blocking error states.
   - `Low` — cosmetic, rare edge case, low business impact.
4. **Write each case in the fixed schema below.** Steps must be concrete and testable
   ("enters username `standard_user`"), never vague ("verify it works").
5. **No selectors, no code.** This is a behavior spec, not an automation spec.

## Output schema

Start with a one-line restatement, then a summary table, then one detailed block per case.

```
### <REQ-ID>: <one-line restatement of the requirement>

#### Assumptions (omit this section if the requirement was unambiguous)
- <assumption 1, and why>

| ID | Title | Priority | Type |
|----|-------|----------|------|
| TC-<REQ-ID>-01 | ... | High/Medium/Low | positive/negative |
| TC-<REQ-ID>-02 | ... | ... | ... |

---

### TC-<REQ-ID>-01: <short descriptive title>
- **Priority:** High | Medium | Low
- **Type:** positive | negative
- **Precondition:** <state the system/user must be in before the scenario starts>
- **Steps (Given-When-Then):**
  - **Given** <initial context>
  - **And** <further context, if needed>
  - **When** <the action under test>
  - **Then** <the observable, testable outcome>
- **Expected Result:** <one crisp, verifiable sentence — what an automated assertion would check>
```

Repeat the detailed block for every row in the summary table. IDs must be stable and unique so
downstream Playwright specs can reference `TC-<REQ-ID>-NN` in test titles/comments for
traceability.

## Guardrails

- Every case must be independently executable (no case may depend on a previous case leaving
  state behind, unless the precondition says so explicitly).
- Prefer one behavior per case. Split compound requirements ("shows an error and does not
  submit") into either one case with a compound Then, or two cases, whichever is clearer — but
  never omit half of a compound requirement to save space.
- Do not soften negative cases into positive ones. "Invalid credentials show an error" must
  produce a case that asserts the error, not just "login form exists."
- If the same skill is re-run on a revised requirement, regenerate test cases from scratch
  rather than patching — this keeps the artifact reproducible and diffable.

## Example invocation

**Input:** "US-1 — Login: A user with valid credentials reaches the products page. Invalid
credentials show an error."

**Output:** see `test-cases.md` in this repo, section US-1, which was produced by this exact
skill.
