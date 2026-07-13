# Debugging notes

Two tooling/process ahas from working on this suite. Not product defects (see
`docs/bug-*.md` for those).

## Aha 1: `cy.log()` never reaches CI output

**Symptom.** Phase markers (`cy.log("Sort by price low -> high")`, etc.) showed
up nicely in the `cypress open` command log, but a headless `cypress run` in
the pipeline printed none of them to the terminal. A CI failure would give no
phase context to triage from.

**Root cause.** `cy.log()` only writes to the Cypress GUI command log. It is
not designed to reach `stdout` in headless mode.

**Fix.** `cy.task("log", message)` with a Node-side `log` handler registered
in `setupNodeEvents` (`cypress.config.js`). The handler runs in the Node
process backing Cypress, so its `console.log` call prints to the real
terminal/CI `stdout`. See `cypress.config.js` and the `cy.task("log", ...)` calls in
`cypress/e2e/checkout.cy.js`.

## Aha 2: gitignored `package-lock.json` broke the first CI approach

**Symptom.** The first CI attempt used the `cypress-io/github-action` wrapper
and failed before running a single test.

**Root cause.** That action hard-requires a committed lockfile on disk to
detect the package manager. `package-lock.json` is gitignored in this repo,
matching the upstream scaffold's own `.gitignore`.

**What almost happened, and why it didn't.** The easiest and comfortable path was
to un-ignore the lockfile and commit it. That would have made the action work,
but it means quietly changing a requirement (the scaffold's own `.gitignore`)
to suit the tooling instead of fitting the tooling to the requirement. Judgment
call: keep the scaffold's `.gitignore` as given, and find another way to get
CI green.

**Fix.** Explicit `actions/setup-node@v4` + `npm install` +
`npm run cypress:run` steps instead of the wrapper action, so no lockfile
needed. Trade-off: no Cypress-binary cache, acceptable for a suite this size.
See `.github/workflows/cypress.yml` (inline comment above the `Set up Node`
step covers the same reasoning).

## Meta: both came down to reviewing AI output, not trusting the first draft

Both ahas surfaced during review of AI-generated work, not at generation time:

- The `cy.log()` choice for CI phase markers should have been questioned
  immediately. Logging that only shows in a GUI, defeats the stated goal of
  debugging a *headless* pipeline.
- The first CI fix (un-ignore the lockfile) technically would have worked, but
  it solved the problem by loosening a constraint rather than working within
  it. It looked correct until checked against the actual requirement.

Takeaway: AI output is a fast draft, not a decision. It has to be checked
against the actual goal and against any fixed constraints, and a fix that
"works" by quietly relaxing a requirement should be rejected in favor of one
that respects it.
