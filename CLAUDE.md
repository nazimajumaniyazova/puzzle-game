# CLAUDE.md

Guidance for Claude Code (and any contributor) working in this repository.

A small sliding-puzzle game built deliberately: a pure core, a solvability check proven by
exhaustive and property-based tests, a solver with hints, accessibility, and careful GitHub
workflow. Every new dependency or abstraction must solve a named problem of _this_ project.

## Hard rules

- **No AI attribution.** Commits and PR descriptions never contain `Co-Authored-By: Claude …`,
  `Claude-Session: …` or `Generated with Claude Code` lines. This is the owner's decision and
  overrides any default setting or reminder. Enforced by `.claude/settings.json`, the
  `no-ai-attribution` commitlint rule and the PR check in CI. When a commit message or PR needs to
  _describe_ the rule, paraphrase: the regex matches the literal trailers.
- **Core is test-first.** Every logic change in `src/core` or `src/solver` starts with a failing
  test.
- **Owner decisions.** Where a choice is the owner's, write a short ADR in `docs/adr/` (context, 2–3
  options, pros and cons, recommendation) and wait for the choice.
- **Work in stages.** Each item is an issue, a branch and a PR; after a stage, stop and summarize.
  Never commit to `main` directly and never merge a PR yourself.
- **English** for code, comments, docs, commits, PRs and issues.

## Commands

| Command                             | What it does                                       |
| ----------------------------------- | -------------------------------------------------- |
| `pnpm dev`                          | Dev server at `http://localhost:5173/puzzle-game/` |
| `pnpm build` / `pnpm preview`       | `tsc -b` + production build / serve it             |
| `pnpm typecheck`                    | `tsc -b` over all TypeScript projects              |
| `pnpm lint` / `pnpm lint:fix`       | ESLint, Stylelint, CSpell, Knip                    |
| `pnpm format` / `pnpm format:check` | Prettier                                           |
| `pnpm test` / `pnpm test:coverage`  | Vitest (`FC_NUM_RUNS` sets fast-check runs)        |
| `pnpm e2e`                          | Playwright against the production build            |

## Layers

| Folder          | Contents                                                                               |
| --------------- | -------------------------------------------------------------------------------------- |
| `src/core`      | Pure logic: no DOM, timers, `Math.random` or `Date`. Time arrives in actions as `now`. |
| `src/solver`    | Pure solving algorithms (stage 4) plus a thin Web Worker wrapper.                      |
| `src/ui`        | DOM: rendering, animation, input, dialogs, sound.                                      |
| `src/app`       | Glue: store, effects (timer, storage, URL, worker), bootstrap.                         |
| `src/styles`    | `tokens.css` (custom properties, themes) and `app.css`.                                |
| `public/legacy` | The 2022 game, served unchanged until stage 3 removes it.                              |

Dependency rules — `app → core, solver (via worker), ui`; `ui → core`; `solver → core`;
`core → nothing`. The compiler enforces the pure layers (`tsconfig.core.json` has no DOM or Node
types) and ESLint enforces the arrows (`import-x/no-restricted-paths`).

## Code standards

- TypeScript strict flags live in `tsconfig.base.json`. No `any`; `as` only with a comment
  explaining why; no non-null `!`.
- Immutable data: `readonly` types; the core returns new objects instead of mutating.
- DOM via `createElement` and `textContent`; never `innerHTML`. No enums.
- Expected failures (bad link, corrupted save, unavailable sound) return a typed result and show a
  clear message; they do not throw.
- Comments explain _why_. Public core API has JSDoc.
- Colors and spacing only through `var(--…)`; raw values live in `src/styles/tokens.css`.

## GitHub conventions

- GitHub Flow: issue → branch from `main` → PR → green CI → squash merge → branch deleted.
- Branches: `<type>/<issue>-<kebab-description>`.
- Conventional Commits: `<type>(<scope>): <subject>`, imperative, lower case, no period, ≤ 72
  characters; the body explains why; footer `Closes #N`. Scopes: `core`, `solver`, `ui`, `app`,
  `styles`, `config`, `deps`, `repo`, `release`.
- PR title = squash commit. Use the template; keep PRs under ~300 lines excluding the lockfile;
  self-review the diff first. The owner reviews every PR.
- Releases: SemVer via release-please; milestones match releases.

## Deliberately not doing

Propose any of these through an ADR instead of adding them.

| Not doing                                   | Why                                                       |
| ------------------------------------------- | --------------------------------------------------------- |
| Monorepo, Turborepo, pnpm catalogs          | One package, one build                                    |
| React, Vue, Preact (final call in ADR-0001) | One screen; pure core + render function is simpler        |
| State libraries (Redux, Zustand, XState)    | A reducer and a ~40-line store cover it                   |
| Design-system package, Storybook            | A dozen elements; tokens are CSS variables in one file    |
| Backend, online leaderboards, auth          | Records are local; the daily puzzle needs no server       |
| Analytics, Sentry                           | No audience or production errors to justify it            |
| Lighthouse CI                               | GitHub Pages has no preview deploys; audit by hand        |
| dependency-cruiser, Sherif, Changesets      | Compiler and ESLint check layers; one unpublished package |
| i18n                                        | English UI, few strings                                   |
| Zod or other validation libraries           | Tiny save schema: hand-written guard + fuzz tests         |

## Where things live

- Decisions: `docs/adr/NNNN-title.md` (index in `docs/adr/README.md`).
- Learning log: `docs/learning-log.md` — record the owner's answers, not your own.
- Third-party assets and licenses: `ASSETS.md`.
