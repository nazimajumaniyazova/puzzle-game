# Contributing

## Run locally

```sh
nvm use            # Node version from .nvmrc
corepack enable    # or install the pnpm version from package.json
pnpm install
pnpm dev           # http://localhost:5173/puzzle-game/
```

Before pushing, the hooks run the same checks as CI. To run them by hand:

```sh
pnpm lint && pnpm typecheck && pnpm test && pnpm e2e
```

## Branches

GitHub Flow: issue → branch from `main` → pull request → green CI → squash merge.

Branch names: `<type>/<issue>-<kebab-description>`, for example `feat/14-undo-redo`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/): `<type>(<scope>): <subject>`.

- Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`.
- Scopes: `core`, `solver`, `ui`, `app`, `styles`, `config`, `deps`, `repo`, `release`.
- Subject in the imperative, lower case, no period, at most 72 characters. The body explains why.
- No AI attribution trailers in commits or pull requests.

The PR title becomes the squash commit, so it follows the same format.
