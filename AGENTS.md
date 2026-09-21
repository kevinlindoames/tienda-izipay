# AGENTS.md — Tienda Izipay

## 1. Purpose

This repository contains the Tienda Izipay ecommerce application.

All automated coding agents working in this repository must prioritize:

- correctness;
- maintainability;
- security;
- accessibility;
- reproducibility;
- minimal and controlled scope;
- explicit validation before integration.

Do not optimize for speed at the expense of these requirements.

---

## 2. Repository architecture

This is a pnpm monorepo managed with Turborepo.

Main applications:

- `apps/web`: Next.js frontend.
- `apps/api`: NestJS backend.

Main technology stack:

### Frontend

- Next.js 16.
- React 19.
- TypeScript.
- App Router.
- Tailwind CSS 4.
- Motion.
- Zustand for client-side UI/application state.
- TanStack Query for remote/server state when appropriate.
- React Hook Form + Zod for forms and validation.

### Backend

- NestJS 11.
- TypeScript.
- Prisma 7.
- PostgreSQL.

### Testing

Frontend:

- Vitest.
- Testing Library.
- Playwright.
- Axe accessibility checks where applicable.

Backend:

- Jest.
- Supertest.

### Tooling

- Node.js 24.x.
- pnpm 11.x.
- Turborepo.
- ESLint.
- Prettier.

Use the versions already pinned by the repository and lockfile.

Do not upgrade framework, runtime, dependency, package-manager, database, or tooling versions unless the user explicitly requests the upgrade.

---

## 3. Package manager

Use `pnpm` only.

Never use:

- `npm install`;
- `npm ci`;
- `yarn`;
- `bun`.

Prefer the repository scripts from the root `package.json`.

Use the existing lockfile.

Never regenerate or replace `pnpm-lock.yaml` unnecessarily.

For reproducibility checks, use the existing frozen-lockfile workflow when applicable.

---

## 4. Frontend architecture

### Server Components first

In Next.js App Router, components must be Server Components by default.

Add `"use client"` only when the component genuinely requires client behavior such as:

- browser events;
- hooks requiring the browser;
- local interactive state;
- Zustand;
- React Hook Form;
- Motion when client execution is necessary.

Keep client boundaries as small as reasonably possible.

Do not convert an entire page or large component tree into Client Components merely because one child is interactive.

### Component organization

Reusable generic UI belongs under reusable UI/component locations already established by the repository.

Feature-specific behavior belongs under:

`features/<feature>`

Avoid large monolithic `page.tsx` files.

Route files should primarily compose feature/components and handle route-specific server behavior.

Do not duplicate logic that already has an established abstraction.

### State management

Use:

- Server Components and server `fetch` for public/server-rendered data when appropriate.
- Zustand for local client state such as cart or temporary client state.
- TanStack Query for remote mutable server state where it provides real value.
- URL `searchParams` for shareable filters, searches and pagination when appropriate.
- React Hook Form + Zod for forms.

Do not introduce Redux or another state-management library without explicit approval.

---

## 5. Backend architecture

NestJS is the business authority.

Do not move authoritative business rules into the browser merely for convenience.

The API/database must remain authoritative for:

- products;
- prices;
- stock;
- orders;
- authentication;
- authorization;
- inventory mutations;
- future payment state.

Preserve module/service/controller separation already established in the application.

Validate external/user input.

Do not trust prices, stock, totals or privileged data supplied by the browser.

---

## 6. Admin architecture

Administrative routes are implemented inside the Next.js application.

The backend remains authoritative for business operations and permissions.

Current admin authentication uses server-side opaque sessions.

Do not replace this architecture with JWT, localStorage, sessionStorage or client-persisted authentication unless explicitly requested.

Session tokens must remain server-side/HttpOnly.

Protected admin routes must remain protected at the server boundary.

Avoid repeated authentication calls when a protected layout can centralize the operation.

Roles currently include:

- `OWNER`
- `ADMIN`

Never weaken role/authorization checks merely to make a UI flow work.

---

## 7. Payments

Izipay payment integration is a future/backend-authoritative concern.

When payment work begins:

- private Izipay credentials must stay in the backend;
- browser code may receive only appropriate public/form-token information;
- server responses must be validated;
- HMAC/signature validation must be server-side;
- IPN/webhook processing must be authoritative and idempotent;
- TEST environment must be completed before production activation.

Never expose private Izipay credentials through `NEXT_PUBLIC_*` variables or frontend bundles.

---

## 8. Secrets and environment files

Never print, disclose, copy or commit secrets.

Do not display values from:

- `.env`;
- `.env.local`;
- production environment variables;
- database passwords;
- private API keys;
- session tokens;
- private Izipay credentials.

It is acceptable to report that a required variable exists or is missing without printing its value.

Do not modify `.env*` files unless the task explicitly requires it.

Never include secrets in:

- logs;
- generated reports;
- test fixtures;
- commits;
- screenshots;
- documentation.

---

## 9. Git safety

Default behavior is conservative.

Before modifying code:

1. inspect the current branch;
2. inspect `git status`;
3. understand the existing diff;
4. determine the requested scope.

Never overwrite unrelated user changes.

Never silently discard local modifications.

### Forbidden without explicit user approval

Do not run:

- `git commit`;
- `git push`;
- `git reset --hard`;
- destructive checkout/restore commands;
- force push;
- history rewriting;
- rebase;
- branch deletion.

`git add` must also not be performed as part of ordinary implementation unless the user explicitly approves the integration/closing block.

Implementation and validation should normally leave changes unstaged for review.

### Commit rules

When explicit commit approval has been given:

- stage only the intended scope;
- inspect staged filenames;
- inspect staged diff;
- run `git diff --cached --check`;
- verify no secrets or artifacts are staged;
- ensure the commit message follows the repository convention;
- verify the resulting commit.

Before push:

- fetch the remote;
- make sure the target branch has not moved unexpectedly;
- never force push unless explicitly requested.

---

## 10. Scope control

Only modify files necessary for the requested task.

Do not perform unrelated:

- refactors;
- renames;
- dependency upgrades;
- formatting sweeps;
- cleanup;
- architectural migrations.

If an unrelated problem is discovered:

1. report it;
2. explain its impact;
3. leave it untouched unless it blocks the current task or the user expands the scope.

Generated files and unrelated existing warnings must not be "fixed" merely because they are visible.

---

## 11. PowerShell and Windows

The primary local environment is Windows.

When a PowerShell script is required, target Windows PowerShell 5.1 compatibility unless the user says otherwise.

Use:

```powershell
$ErrorActionPreference = "Stop"
```

Scripts must fail fast.

Never print a success result after a failing command.

### Native command execution

Windows PowerShell 5.1 may transform native stderr into `NativeCommandError` when `$ErrorActionPreference = "Stop"`.

For important scripted quality gates, prefer a robust native-command wrapper using `Start-Process`, separate temporary stdout/stderr files, and explicit process exit-code validation.

Do not assume that text written to stderr means the native command failed.

The native process exit code is authoritative.

### Script safety

Before a script modifies repository state, perform a preflight.

Where applicable verify:

- expected repository path;
- branch;
- HEAD/base;
- working tree;
- staged files;
- allowed scope.

Never execute destructive commands to "repair" an unexpected state.

Stop and report instead.

---

## 12. Quality gates

Do not claim a task is complete merely because the edited code looks correct.

Run the relevant tests after modifications.

The principal repository quality gate is:

```powershell
pnpm.cmd check
```

Where the environment supports `pnpm` directly, the equivalent repository command may be used.

Also use:

```powershell
git diff --check
```

before integration.

For changes involving browser behavior, routing, checkout, cart, catalog, admin flows, accessibility or other E2E-covered behavior, run the relevant Playwright tests.

For significant changes, run the full E2E suite when appropriate:

```powershell
pnpm.cmd --filter web test:e2e
```

Do not weaken tests merely to obtain green output.

Do not:

- delete assertions without justification;
- ignore console errors to make tests pass;
- add arbitrary sleeps;
- increase timeouts as the first solution;
- skip failing tests without explicit justification.

Diagnose the root cause.

---

## 13. Playwright isolation

Playwright E2E must use its controlled test servers.

Do not allow an already-running development server to silently replace the configured Playwright web server.

The repository may use an E2E-specific image strategy or environment condition to remove unreliable external image/network dependencies during automated tests.

Production behavior must remain unchanged by E2E-only deterministic fixtures.

Do not weaken console-error tests to hide external-resource failures.

---

## 14. External dependencies during tests

Automated tests should be deterministic where practical.

Avoid adding unnecessary dependence on unreliable third-party resources to E2E tests.

When a deterministic local fixture can replace a non-business-critical external resource during testing, prefer the local fixture while preserving production behavior.

Do not mock or replace real business/database behavior unless the test architecture explicitly calls for it.

---

## 15. Database and Prisma

PostgreSQL is the authoritative database.

Prisma schema/migrations must be treated carefully.

Never edit already-applied production migration files to change history.

For schema changes:

1. inspect the existing Prisma schema;
2. determine compatibility;
3. create a new migration;
4. validate Prisma;
5. generate the client;
6. run relevant tests.

Do not reset or wipe the database without explicit authorization.

Never run destructive SQL casually.

---

## 16. Accessibility

Accessibility is part of the implementation requirement, not optional polish.

For interactive UI preserve or implement:

- semantic HTML;
- keyboard operation;
- visible focus;
- proper labels;
- `aria-current` where appropriate;
- meaningful accessible names;
- suitable touch target sizes;
- contrast;
- reduced-motion behavior where relevant.

Do not remove accessibility behavior merely to simplify styling.

---

## 17. Responsive behavior

Frontend changes must consider:

- mobile;
- tablet;
- desktop.

Avoid horizontal document overflow.

Do not assume a desktop-only layout unless explicitly required.

Interactive admin/public navigation must remain usable on mobile.

---

## 18. Styling

Use the styling system already present in the project.

Prefer existing design tokens/utilities.

Do not introduce a new UI framework or component library without explicit approval.

Avoid arbitrary values when an existing project token or established utility is appropriate.

Do not perform large visual redesigns outside the requested scope.

---

## 19. Error handling

Do not swallow errors silently.

User-facing errors should be understandable without leaking sensitive implementation details.

Server logs may contain useful diagnostics but must not expose secrets.

When an external service fails, distinguish:

- application defect;
- test-infrastructure defect;
- environment defect;
- third-party service failure.

Do not modify application behavior until the actual category is established.

---

## 20. Reports and generated evidence

If the task requests an audit or consolidated validation report, store reports under the repository's established `reports` location.

Reports must not contain secrets.

Reports are diagnostic artifacts and must not be committed unless explicitly requested.

Do not stage:

- `reports/` unless explicitly requested;
- `.next/`;
- `node_modules/`;
- Playwright HTML reports;
- test-result screenshots/videos;
- generated temporary output.

---

## 21. Implementation workflow

For substantial work use this sequence:

### A. Inspect

Understand:

- user request;
- current repository state;
- architecture;
- related code;
- tests;
- scope.

### B. Plan

State the intended implementation boundaries.

Prefer cohesive implementation blocks over many tiny unrelated edits.

### C. Implement

Make the smallest coherent change that fully solves the task.

### D. Validate

Run:

- relevant targeted tests;
- lint/typecheck/build as applicable;
- repository quality gates;
- `git diff --check`;
- relevant E2E.

### E. Review

Inspect:

- changed files;
- diff;
- architecture;
- accidental changes;
- secrets;
- generated artifacts.

### F. Stop before integration

Unless explicit integration approval was already provided:

- do not stage;
- do not commit;
- do not push.

Report the result and wait for approval.

---

## 22. Definition of done

A coding task is complete only when:

- the requested behavior is implemented;
- architecture remains consistent;
- scope is controlled;
- relevant tests pass;
- required quality gates pass;
- no secrets are exposed;
- no unintended files changed;
- failures or remaining warnings are disclosed;
- integration has not exceeded the user's explicit authorization.

Never say a task passed if a mandatory gate failed.

Never hide a failure behind partial success.

---

## 23. Communication style

Explain changes clearly enough for a junior developer to follow.

For important findings, report:

- what was found;
- why it matters;
- what changed;
- what was validated;
- any remaining risk.

Prefer concise but complete output.

Do not flood the user with every low-level command when a grouped explanation is clearer.

When a command fails, focus first on the earliest/root failure rather than cascading secondary failures.

---

## 24. Existing warnings

Do not treat a pre-existing warning as a new defect unless the current task caused it.

Record existing warnings separately from new failures.

Do not broaden scope to fix existing warnings unless requested or they block the task.

---

## 25. Instruction hierarchy

Follow direct user instructions first.

Then follow the applicable repository `AGENTS.md`.

A more deeply nested `AGENTS.md` applies to its subtree and may provide more specific rules.

If instructions conflict or a requested action is destructive, stop and surface the conflict rather than guessing.
