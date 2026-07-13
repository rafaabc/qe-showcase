# QE Showcase

[![E2E Tests](https://github.com/rafaabc/qe-showcase/actions/workflows/cypress.yml/badge.svg)](https://github.com/rafaabc/qe-showcase/actions/workflows/cypress.yml)

Welcome!

This repository is a take-home exercise for Quality Engineering (QE) candidates. The goal is **not** to grade you on correctness or to create a pass/fail test. Instead, we want to see how you approach real-world quality engineering problems, communicate your thought process, and use your favorite tools.

Use the tools and workflow you would normally use on the job—including documentation, IDE assistants, or anything else you rely on in real work.

**Choose your own adventure:**  
Pick **one** of the following paths (see `/tasks/` for details):

- **Cypress**: Write an end-to-end test for a sample web app.
- **Postman**: Create an API test collection.

**What we care about:**

- How you structure your code and tests
- Realistic assertions and thoughtful test cases
- Clear communication (in code, comments, and your PR)
- Basic Git usage (branch, commit, PR)
- Risk-based thinking — what you chose to test and what you intentionally skipped

**What we _don't_ care about:**

- Perfection or "the right answer"
- Full coverage or exhaustive edge cases
- CI/CD pipelines (not required — if you add one because that's how you normally work, we'll treat it as a bonus signal, not a bar)

**How to proceed:**

1. Fork this repo.
2. Pick a task from `/tasks/` and follow the instructions.
3. Don't spend more than 30 minutes on this.
4. Open a PR with your solution. Use the PR template to tell us about your approach.
5. Be ready to walk through your submission and explain your choices — we may ask follow-up questions live or in PR comments.

We'll leave comments and may ask questions — we're interested in your reasoning and how you respond, not just what you build.

**Have fun, and thank you for sharing your process with us!**

---

## Getting Started with Tooling

This repo includes the tools you'll need for any of the tasks:

- **Cypress** (UI/E2E)
- **Newman** (run Postman collections from the command line)

**Install dependencies:**

```bash
npm install
```

**Run Cypress:**

- Open interactive UI:  
  `npm run cypress:open`
- Run headless:  
  `npm run cypress:run`

**Run Newman:**

- `npm run newman`  
  (Edit the collection path as needed)

---
