# Contributing to SkillVault

Thanks for your interest in SkillVault. This is a small, local-first React app: every contribution should preserve the rule that skills and settings stay in the browser and no runtime dependency is added without discussion.

## Running locally

```bash
git clone https://github.com/webxiongda/skillvault.git
cd skillvault && npm install
npm run dev
```

Open `http://localhost:5173`. Before opening a pull request, check both build gates:

```bash
npm run build
npm run preview
```

`npm run build` runs `tsc --noEmit` and then Vite's production build. It must pass with no TypeScript errors.

## Making a change

1. Open an issue first for anything beyond a small fix, so we can agree on the approach.
2. Fork the repository and create a focused branch from `main`.
3. Keep each pull request to one concern — a parser fix and a new feature are two PRs.
4. Describe what changed, why, and how you verified it. Include a screenshot when the change is visible in the UI.
5. Make sure `npm run build` passes before requesting review.

## Code style

- TypeScript with `strict`, `noUnusedLocals`, and `noUnusedParameters`. Avoid `any`; prefer the types in `src/types.ts`.
- Business-facing comments and user-facing error messages are written in Chinese, matching the existing code and UI. Keep identifiers, commit messages, and documentation in English.
- Match the surrounding style: single quotes, no semicolons, two-space indentation, and inline SVG icons from `src/icons.tsx` instead of an icon library.
- Pages live in `src/pages/` and are registered in `src/routes.ts`. A new page must appear in that registry so navigation, hash validation, and the default route stay in sync.
- Do not add runtime dependencies. The browser bundle is intentionally limited to `react` and `react-dom`.
- Keep persistence tolerant: reads from `localStorage` must handle missing, malformed, or outdated data and fall back safely.

## Commit convention

Use short, imperative commit messages prefixed with one of:

- `feat:` — a new capability or page
- `fix:` — a bug fix
- `refactor:` — restructuring without changing behavior
- `chore:` — tooling, dependencies, or documentation

## Good first issues

- Add a new example skill to `src/data.ts` with a complete, valid `SKILL.md` body.
- Extend `parseSkillMarkdown` to handle more frontmatter forms, with clear Chinese error messages.
- Improve filters in the Advanced search page or add a sort option.
- Tighten import validation in `normalizeImportedSkills` and its preview.
- Improve keyboard navigation and accessibility in the card grid and detail drawer.

## Code of conduct

Be respectful and constructive; assume good intent and keep discussions focused on the work.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
