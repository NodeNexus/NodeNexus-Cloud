# Contributing Guidelines

We welcome contributions to VNAV Cloud! Please adhere to the following rules based on our internal `AGENTS.md` spec.

## Branching Strategy
- `main`: Stable production branch.
- `dev`: Active development branch.
Create feature branches from `dev` using the format: `feat/your-feature-name` or `fix/your-fix-name`.

## Architectural Rules
1. **Strict TypeScript**: Do not use `any`. Define proper interfaces for all API payloads.
2. **Component Modularity**: Never duplicate code. Extract shared UI logic into `src/components/ui`.
3. **No Inline CSS**: Always use Tailwind utility classes.
4. **Type Hints**: All Python backend functions must have strict type hinting and Pydantic schemas.

## Pull Requests
1. Ensure all tests pass (`pytest` and `vitest`).
2. Ensure the code is linted (`npm run lint`).
3. Provide a clear description of the problem solved in your PR.
