---
trigger: always_on
---

* Project language: English for code, comments, commits, issues
* Framework: Next.js 14+ (App Router), TypeScript strict, pnpm
* Styling: Tailwind CSS; CSS Modules only when necessary
* UI library: shadcn/ui for primitives and patterns
* State: prefer Server Components; client state via React Query or Zustand
* Imports: absolute with `@/*`; no deep relative chains
* Components: one file per component; co-locate tests and styles
* Naming: PascalCase components, useCamelCase hooks, is/has booleans
* Side effects: none at module root to support RSC
* Accessibility: keyboard navigation, focus-visible, alt text, WCAG AA contrast
* Forms: labeled controls, inline validation messages, ARIA where needed
* Performance: first-load JS budget ≤ 200KB gz per route
* Images: use optimized images and proper sizing; lazy load media
* Code-splitting: dynamic import heavy client components
* Caching: leverage Next fetch cache and revalidation; avoid client waterfalls
* Data validation: Zod for all inbound payloads (forms, API)
* Server actions: use for mutations when possible; else API routes
* Error handling: typed results, user-friendly toasts, server logging
* Security: never trust input; sanitize HTML; rate-limit sensitive endpoints
* Secrets: use `.env.local`; never commit; prefix public vars with `NEXT_PUBLIC_`
* Git: protected `main`; feature branches `feat/<scope>-<name>`
* Commits: Conventional Commits; small, scoped, meaningful messages
* PRs: one logical change per PR; screenshots for UI; checklist included
* Reviews: require typecheck, lint, tests, and build to pass
* Testing: Vitest unit, React Testing Library for UI, Playwright e2e
* Linting/formatting: ESLint + Prettier; fix on commit with Husky
* CI: install, typecheck, lint, test, build on PR and main
* Releases: semantic versioning; changelog from conventional commits
* Monitoring: basic web-vitals and error reporting in production
* Directory: `/app` routes, `/components` UI, `/lib` utils/api, `/styles`, `/public`
* Hooks: reusable logic in `/lib/hooks`; no ad-hoc hooks in pages
* Validation schemas: colocate in `/lib/validation` and reuse on client/server
* Design tokens: manage colors, radii, spacing in Tailwind theme
* Brand accents: yellow-gold highlights inspired by Higgsfield (`#F5D90A` / `#E6B400`)
* Theming: dark by default; light as optional toggle
* i18n: English default; wrap strings for future localization
* Analytics: privacy-respecting, opt-out capable
* Assets: optimize and compress; store large media outside repo
* Documentation: keep `PROJECT_RULES.md` and short READMEs per feature
* Issue labels: type, priority, status; keep backlog groomed weekly
* Cursor usage: scaffold boilerplate, then refine; always run typecheck + lint after AI edits
* AI safety: never accept generated secrets or unknown remote code without review
